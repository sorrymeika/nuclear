import component from "../../../../component";

const Json = [{
    type: 'form',
    props: {
        name: 'form'
    },
    children: [{
        type: 'select',
        props: {
            label: '项目',
            field: 'data.projectName',
            placeholder: '选择目标项目',
            onChange: 'onProjectChange',
            rules: [{ required: true }],
            dataSourceName: 'projects'
        },
    }, {
        type: 'autocomplete',
        props: {
            label: '页面名',
            field: 'name',
            rules: [{ required: true }, { pattern: /^[A-Z]/, message: '页面请用帕斯卡命名' }],
            dataSourceName: 'pageNames',
            onChange: 'onPageChange'
        }
    }, {
        type: 'textarea',
        props: {
            label: '路由',
            field: 'route',
            autosize: 'true'
        }
    }]
}, {
    type: 'fieldset',
    props: {
        title: '快捷键',
    },
    children: [{
        type: 'label',
        value: 'cmd+o: 打开页面',
        className: 'dp_b fs_m ml_m'
    }, {
        type: 'label',
        value: 'cmd+k: 页面设置',
        className: 'dp_b fs_m ml_m'
    }, {
        type: 'label',
        value: 'cmd+u: 编辑UI JSON',
        className: 'dp_b fs_m ml_m'
    }, {
        type: 'label',
        value: 'cmd+i: 编辑CSS',
        className: 'dp_b fs_m ml_m'
    }, {
        type: 'label',
        value: 'cmd+j: 编辑JS',
        className: 'dp_b fs_m ml_m'
    }, {
        type: 'label',
        value: 'cmd+e: 切换项目',
        className: 'dp_b fs_m ml_m'
    }, {
        type: 'label',
        value: 'cmd+p: 切换页面',
        className: 'dp_b fs_m ml_m'
    }, {
        type: 'label',
        value: 'cmd+s: 保存页面',
        className: 'dp_b fs_m ml_m'
    }]
}];

@component(Json)
class PageSettings {
}

export { PageSettings };