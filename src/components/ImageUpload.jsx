import React, { Component } from 'react';
import { Modal, Upload, Icon, message } from 'antd';
import DraggableList from './DraggableList';

import { util } from 'snowball';
import { inject } from 'snowball/app';

export interface IImage {
    src: string;
    name: string;
}

export interface ImageUploadProps {
    field?: string,
    value: string[] | IImage[],
    onChange?: (files: any[], names: any[]) => any,
    action: string,
    processSrc?: (url: string) => string,
    processResp?: (response: any) => string,
    multiple?: boolean,
    sortable?: boolean,
    withCredentials?: boolean,
    limit: number,
    maxSize: number,
    restrict: {
        width: number,
        height: number
    } | {
        minHeight: number,
        maxHeight: number,
        minWidth: number,
        maxWidth: number
    },
}

export interface ImageProps {
    uid: any,
    name: string,
    src: string,
    url: string,
    status: 'done' | 'removed' | 'uploading' | 'error'
}

export interface ImageUploadState {
    fileList: ImageProps[] | null,
    isUpdating: boolean
}

/**
 * TFS上传要求：
 * withCredentials={true}
 * headers={{ 'X-Requested-With': null }}
 *
 * @export
 * @class ImageUpload
 * @extends {Component<ImageUploadProps, ImageUploadState>}
 */
class ImageUpload extends Component<ImageUploadProps, ImageUploadState> {
    constructor(props: ImageUploadProps) {
        super(props);

        this.state = {
            fileList: props.value
                ? this.valueToFileList(props.value)
                : [],
            isUpdating: false
        };
    }

    componentDidUpdate(prevProps) {
        if (!this.props.value && !this.state.fileList.length) {
            return;
        }
        if (!util.equals(this.props.value, this.state.fileList.map((file) => file.src))) {
            this.updateFileList(this.valueToFileList(this.props.value));
        }
    }

    updateFileList(fileList, cb) {
        this.setState({
            fileList,
            isUpdating: true
        }, () => {
            this.setState({
                isUpdating: false
            }, cb);
        });
    }

    valueToFileList(value) {
        if (!Array.isArray(value)) {
            value = [value];
        }

        const { processSrc } = this.props;

        return value.map((image) => (util.isObject(image)
            ? {
                uid: image.src,
                name: image.name,
                src: image.src,
                url: processSrc ? processSrc(image.src) : image.src,
                status: 'done'
            }
            : {
                uid: image,
                name: image,
                src: image,
                url: processSrc ? processSrc(image) : image,
                status: 'done'
            }));
    }

    onChange = (info) => {
        const { limit } = this.props;
        const fileList = info.fileList.slice(0, limit);

        if (info.file.status === 'done') {
            const { processResp } = this.props;

            const response = info.file.response;
            const src = processResp
                ? processResp(response)
                : response && typeof response === 'object'
                    ? response.src
                    : response;

            if (src) {
                const image = fileList.find(file => info.file.uid == file.uid);
                const { processSrc } = this.props;

                image.src = src;
                image.url = processSrc ? processSrc(src) : src;

                message.success(`上传成功`);
            } else {
                util.remove(fileList, 'uid', info.file.uid);
                message.error(`${info.file.name} 上传失败！`);
            }
        } else {
            switch (info.file.status) {
                case 'error':
                    message.error(`${info.file.name} 文件上传失败.`);
                    break;
                case 'removed':
                    break;
            }
        }

        if (fileList.every((file) => file.status && file.status != 'uploading')) {
            this.updateFileList(fileList, () => {
                var doneFiles = fileList.filter((file) => file.status === 'done');
                this.props.onChange && this.props.onChange(doneFiles.map(file => file.src), doneFiles.map(file => file.name));
            });
        } else if (info.file.status === undefined) {
            this.updateFileList(this.state.fileList);
        }
    }

    validImageRect(imageWidth, imageHeight) {
        const { restrict } = this.props;
        if (!restrict) return { success: true };

        const {
            minWidth,
            maxWidth,
            minHeight,
            maxHeight,
            width,
            height,
            isSquare
        } = restrict;
        let msg = "请上传";
        let success = true;
        if (isSquare && imageWidth !== imageHeight) {
            msg += "正方形";
        }
        if (width) {
            if (imageWidth !== width) {
                success = false;
                msg += "宽度为" + width;
            }
        } else {
            if ((minWidth && imageWidth < minWidth) || (maxWidth && imageWidth > maxWidth)) {
                success = false;
                msg += "宽度为" + minWidth + '-' + maxWidth;
            }
        }
        if (height) {
            if (imageHeight !== height) {
                success = false;
                msg += "高度为" + height;
            }
        } else {
            if ((minHeight && imageHeight < minHeight) || (maxHeight && imageHeight > maxHeight)) {
                success = false;
                msg += "高度为" + minHeight + '-' + maxHeight;
            }
        }

        return { success, msg: success ? "上传成功" : (msg + "的图片") };
    }

    beforeUpload = (file) => {
        const props = this.props;
        const {
            maxSize = 300,
            fileTypes = [
                'image/jpg',
                'image/jpeg',
                'image/png'
            ]
        } = props;

        if (!fileTypes.includes(file.type)) {
            message.error('请上传格式为jpg,png的图片');
            return false;
        }

        if (file.size > maxSize * 1024) {
            message.error(`请上传不超过${maxSize}KB的图片`);
            return false;
        }

        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                var testSizeImg = new Image();
                testSizeImg.onload = () => {
                    var res = this.validImageRect(testSizeImg.width, testSizeImg.height);
                    if (res.success) {
                        resolve();
                    } else {
                        message.error(res.msg);
                        reject(res.msg);
                    }
                };
                testSizeImg.onerror = function () {
                    reject();
                };
                testSizeImg.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }

    render() {
        var props = this.props;
        const { action } = props;

        return (
            <DraggableList
                draggable={props.sortable !== false ? ".ant-upload-list-item" : false}
                onDragEnd={
                    (oldIndex, newIndex) => {
                        const fileList = this.state.fileList;
                        const tmp = fileList[newIndex];

                        fileList[newIndex] = fileList[oldIndex];
                        fileList[oldIndex] = tmp;

                        this.updateFileList(fileList, () => {
                            this.props.onChange && this.props.onChange(fileList.map(file => file.src), fileList.map(file => file.name));
                        });
                    }
                }
            >
                <Upload
                    {...props}
                    {...Object.assign(
                        {
                            defaultFileList: this.state.fileList
                        },
                        this.state.isUpdating ? { fileList: this.state.fileList } : null
                    )}
                    withCredentials={props.withCredentials !== false}
                    headers={{ 'X-Requested-With': null }}
                    name={props.field || 'image'}
                    action={action}
                    listType={props.listType || 'picture-card'}
                    multiple={props.multiple !== false}
                    onChange={this.onChange}
                    beforeUpload={this.beforeUpload}
                    onPreview={
                        (file) => {
                            this.setState({
                                previewImage: file.url || file.thumbUrl,
                                previewVisible: true,
                            });
                        }
                    }
                >
                    {
                        this.state.fileList.length >= props.limit ? null : (
                            <div>
                                <Icon type="plus" />
                                <div className="ant-upload-text">Upload</div>
                            </div>
                        )
                    }
                </Upload>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={() => {
                    this.setState({ previewVisible: false });
                }}>
                    <img style={{ width: '100%' }} src={this.state.previewImage} alt="" />
                </Modal>
            </DraggableList>
        );
    }
}

export default inject(({ ctx }) => (
    ctx && ctx.env && ctx.env.IMAGE_UPLOAD_URL
        ? {
            action: ctx.env.IMAGE_UPLOAD_URL
        }
        : {}
))(ImageUpload);