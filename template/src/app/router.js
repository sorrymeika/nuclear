import HomeController from "./home/controllers/HomeController";

export default {
    '/test': import("../Test"),
    '/home': HomeController,
};