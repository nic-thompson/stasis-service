"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ari_client_1 = __importDefault(require("ari-client"));
const wait_on_1 = __importDefault(require("wait-on"));
const url = "localhost:8088";
const username = "username";
const password = "password";
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ariClient = yield ari_client_1.default.connect(`http://${url}`, username, password);
        return ariClient;
    }
    catch (error) {
        console.error(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, wait_on_1.default)({
            resources: [`http-get://${url}/ari/asterisk/info`],
            delay: 1000,
            simultaneous: 1,
            timeout: 30000,
            auth: {
                username,
                password,
            },
        });
        const ariClient = yield connect();
        if (ariClient) {
            console.log("Connected to ARI");
            ariClient.on("StasisStart", (event, channel) => {
                console.log(event);
                console.log(channel);
            });
            ariClient.on("StasisEnd", () => {
                console.log('StasisEnd');
            });
            yield ariClient.start("vocoo-voice");
        }
    }
    catch (error) { }
}));
