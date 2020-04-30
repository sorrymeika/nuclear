import { observable, asObservable } from "snowball";
import { JsonComponent } from "./component";

export class SettingsBase extends JsonComponent {
    @observable isInForm = false;
    @observable data = {};

    constructor(props) {
        super();

        this.isInForm = props.isInForm;
        this.data = {
            ...new.target.defaultData,
            ...props.defaultData,
        };

        const didMount = this.componentDidMount;
        this.componentDidMount = () => {
            asObservable(this).observe('data', (data) => {
                this.props.onChange && this.props.onChange(data);
            });
            didMount && didMount.call(this);
        };

        const renderJson = this.renderJson;

        this.renderJson = () => {
            return [{
                type: 'form',
                props: {
                    ref: (ref) => {
                        this.form = ref && ref.form;
                    }
                },
                children: renderJson.call(this)
            }];
        };
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.defaultData != this.props.defaultData) {
            this.data = {
                ...this.constructor.defaultData,
                ...nextProps.defaultData,
            };
        }
        if (nextProps.isInForm != this.props.isInForm) {
            this.isInForm = nextProps.isInForm;
        }
        return true;
    }

    validateFields = (cb) => {
        this.form && this.form.validateFields((err) => {
            cb(err, this.processData ? this.processData(this.data) : this.data);
        });
    }
}