import React from 'react';
import { message } from 'antd';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const controls = [
    'undo', 'redo', 'separator',
    'font-size', 'line-height', 'letter-spacing', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
    'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
    'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
    'link', 'separator', 'hr', 'separator',
    'media', 'separator',
    'clear', 'separator', 'fullscreen'
];

const createUploadFn = ({ uploadUrl, processResp }) => (param) => {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = (response) => {
        if (processResp) {
            try {
                param.success(processResp(xhr.responseText));
            } catch (error) {
                param.error({
                    msg: error.message
                });
            }
        } else {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            param.success({
                url: xhr.responseText
            });
        }
    };

    const progressFn = (event) => {
        // 上传进度发生变化时调用param.progress
        param.progress(event.loaded / event.total * 100);
    };

    const errorFn = (response) => {
        // 上传发生错误时调用param.error
        param.error({
            msg: '上传失败!'
        });
    };

    xhr.upload.addEventListener("progress", progressFn, false);
    xhr.addEventListener("load", successFn, false);
    xhr.addEventListener("error", errorFn, false);
    xhr.addEventListener("abort", errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', uploadUrl, true);
    xhr.send(fd);
};

const validImageRectRange = (imageRectRange, imageWidth, imageHeight) => {
    const {
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        width,
        height,
        isSquare
    } = imageRectRange;
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
};

const createValidateFn = ({ imageRectRange, imageMaxSize = 100 }) => (file) => {
    if (file.size > 1024 * imageMaxSize) {
        message.error(`请上传不超过${imageMaxSize}KB的图片`);
        return false;
    }
    return imageRectRange
        ? new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                var testSizeImg = new Image();
                testSizeImg.onload = () => {
                    var res = validImageRectRange(imageRectRange, testSizeImg.width, testSizeImg.height);
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
        })
        : true;
};

export default function NCRichText({
    uploadUrl,
    imageMaxSize,
    imageRectRange,
    processResp,
    media,
    ...props
}) {
    const defaultMedia = {
        uploadFn: createUploadFn({ uploadUrl, processResp }),
        validateFn: createValidateFn({ imageMaxSize, imageRectRange }),
        accepts: {
            image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
            video: false,
            audio: false
        },
        externals: {
            video: false,
            audio: false,
            embed: false
        },
        ...media
    };
    return (
        <BraftEditor
            controls={controls}
            media={defaultMedia}
            {...props}
        />
    );
}

NCRichText.createEditorState = BraftEditor.createEditorState;