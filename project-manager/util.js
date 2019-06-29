export const getBody = (request) => {
    let body = "";

    request.on("data", function (dt) {
        body += dt;
    });

    return new Promise((resolve) => {
        request.on("end", function () {
            resolve(body);
        });
    });
};