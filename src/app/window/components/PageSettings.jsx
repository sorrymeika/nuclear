import { observable } from "snowball";
import { inject } from "snowball/app";

import component from "../../../atoms/component";

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
            onChange: '{onProjectChange}',
            rules: [{ required: true }],
            dataSource: '{projects}'
        },
    }, {
        type: 'autocomplete',
        props: {
            label: '页面名',
            field: 'data.pageName',
            rules: [{ required: true }, { pattern: /^[A-Z]/, message: '页面请用帕斯卡命名' }],
            dataSource: '{pageNames}',
            onChange: '{onPageChange}'
        }
    }, {
        type: 'textarea',
        props: {
            label: '路由',
            field: 'data.route',
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
        props: {
            value: 'cmd+o: 打开页面',
            className: 'dp_b fs_m ml_m'
        }
    }, {
        type: 'label',
        props: {
            value: 'cmd+k: 页面设置',
            className: 'dp_b fs_m ml_m'
        }
    }, {
        type: 'label',
        props: {
            value: 'cmd+u: 编辑UI JSON',
            className: 'dp_b fs_m ml_m'
        }
    }, {
        type: 'label',
        props: {
            value: 'cmd+i: 编辑CSS',
            className: 'dp_b fs_m ml_m'
        }
    }, {
        type: 'label',
        props: {
            value: 'cmd+j: 编辑JS',
            className: 'dp_b fs_m ml_m'
        }
    }, {
        type: 'label',
        props: {
            value: 'cmd+e: 切换项目',
            className: 'dp_b fs_m ml_m'
        }
    }, {
        type: 'label',
        props: {
            value: 'cmd+p: 切换页面',
            className: 'dp_b fs_m ml_m'
        }
    }, {
        type: 'label',
        props: {
            value: 'cmd+s: 保存页面',
            className: 'dp_b fs_m ml_m'
        }
    }]
}];

@component(Json)
class PageSettings {
    @observable data = {};
    @observable projects = [];
    @observable pageNames = [];
    @observable currentProjectName;

    constructor({ defaultData }) {
        this.data = defaultData || {};
    }

    async onInit() {
        const projects = await this.props.requestProjects();
        this.projects = projects.map((proj) => ({
            text: proj.name,
            value: proj.name
        }));

        if (this.data.projectName) {
            this.onProjectChange(this.data.projectName);
        }

        this.asModel().observe('data', (data) => {
            this.props.onChange && this.props.onChange(data);
        });
        this.props.formRef.current = this.form;
    }

    async onProjectChange(projectName) {
        this.currentProjectName = projectName;

        if (projectName) {
            const res = await this.props.requestPagesByProject(projectName);
            this.pageNames = res.pages.map((page) => page.name);
        } else {
            this.pageNames = [];
        }
    }

    onPageChange(name) {
    }

    onDestroy() {
        this.asModel().destroy();
    }
}

const PageSettingsInjc = inject(({ projectService, pageService }) => ({
    requestProjects: projectService.getProjects,
    requestPagesByProject: pageService.getPagesByProject
}))(PageSettings);

export { PageSettings, PageSettingsInjc };