import React, { Component } from 'react';
import { Modal, Upload, Icon, message } from 'antd';
import { util } from 'snowball';

import DraggableList from './DraggableList';

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
    sortable?: boolean,
    withCredentials?: boolean,
    max: number,
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
export default class ImageUpload extends Component<ImageUploadProps, ImageUploadState> {
    static defaultProps = {
        max: 1
    }

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
        if ((!this.props.value && !this.state.fileList.length) || this.state.isUpdating) {
            return;
        }
        let value = Array.isArray(this.props.value)
            ? this.props.value
            : this.props.value
                ? [this.props.value]
                : [];

        if (!util.equals(value, this.state.fileList.map((file) => file.src))) {
            this.setState({
                fileList: this.valueToFileList(value)
            });
        }
    }

    updateFileList(fileList, cb) {
        this.setState({
            fileList,
            isUpdating: true
        }, () => {
            cb && cb();
            this.setState({
                isUpdating: false
            });
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
        const { max } = this.props;
        const fileList = info.fileList.slice(0, max);

        const origFileList = this.state.fileList;

        this.setState(() => {
            return {
                isUpdating: true,
                fileList: info.fileList
            };
        });

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
            this.setState({
                fileList,
                isUpdating: true
            }, () => {
                if (this.props.onChange) {
                    const doneFiles = fileList.filter((file) => file.status === 'done');
                    if (this.props.max === 1) {
                        if (!doneFiles.length) {
                            this.props.onChange(null, null);
                        } else {
                            this.props.onChange(doneFiles[0].src, doneFiles[0].name);
                        }
                    } else {
                        this.props.onChange(doneFiles.map(file => file.src), doneFiles.map(file => file.name));
                    }
                }
                this.setState({
                    isUpdating: false
                });
            });
        } else if (info.file.status === undefined) {
            this.updateFileList(origFileList);
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
            message.error('请上传格式为' + fileTypes.map(type => type.replace(/^image\//, '')).join('、') + '的图片');
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

    previewImage = (file, e) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    render() {
        const props = this.props;
        const { action } = props;

        return (
            <>
                <DraggableList
                    draggable={props.sortable !== false && props.max > 1 ? ".ant-upload-list-item" : false}
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
                        fileList={this.state.fileList}
                        withCredentials={props.withCredentials !== false}
                        headers={{ 'X-Requested-With': null }}
                        name={props.field || 'image'}
                        action={action}
                        showUploadList={props.max > 1}
                        listType={props.max == 1 ? 'picture' : 'picture-card'}
                        multiple={props.max > 1}
                        onChange={this.onChange}
                        beforeUpload={this.beforeUpload}
                        onPreview={this.previewImage}
                    >
                        {
                            this.state.fileList.length >= props.max
                                ? props.max === 1
                                    ? (
                                        <div className="nc-ant-upload-image">
                                            <img
                                                src={this.state.fileList.length ? this.state.fileList[0].url : null}
                                                alt=""
                                            />
                                            <div className="nc-ant-upload-image-operation flex jc_c">
                                                <Icon
                                                    type="eye"
                                                    onClick={this.previewImage.bind(this, this.state.fileList[0])}
                                                />
                                                <Icon
                                                    type="delete"
                                                    onClick={(e) => {
                                                        this.setState({
                                                            fileList: []
                                                        });
                                                        this.props.onChange(null, null);
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                />
                                                <Icon type="upload" style={{ cursor: 'pointer' }} />
                                            </div>

                                        </div>
                                    )
                                    : null
                                : (
                                    <div className="nc-ant-upload-content">
                                        <Icon type="plus" />
                                        <div className="ant-upload-text">上传图片</div>
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
            </>
        );
    }
}
