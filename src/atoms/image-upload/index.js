import { registerAtom } from "../factories";
import ImageUpload from "./ImageUpload";
import ImageUploadSettings from "./ImageUploadSettings";

registerAtom({
    type: 'imageupload',
    name: 'ImageUpload',
    group: 'Form',
    atomComponent: ImageUpload,
    decorationComponent: ImageUpload,
    settingsComponent: ImageUploadSettings,
    propsConfig: {}
});