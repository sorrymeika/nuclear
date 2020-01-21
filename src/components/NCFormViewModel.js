import { Service, ref, emitter } from "snowball/app";
import { observable } from "snowball";

export default class NCFormViewModel extends Service {
    @observable
    data = {};

    @ref ref;

    onSubmit = this.ctx.createEmitter();
    onReset = this.ctx.createEmitter();
    onError = this.ctx.createEmitter();

    @emitter
    onFieldsChange(data) {
        this.data.withMutations((formData) => {
            formData.set(data);
        });
    }

    resetValidator() {
        this.ref.current && this.ref.current.resetValidator();
    }

    submit() {
        this.ref.current.submit();
    }
}