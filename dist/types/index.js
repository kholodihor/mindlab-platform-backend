"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileType = exports.UploadImageResponse = exports.NotFoundResponse = exports.IUser = void 0;
const swagger_1 = require("@nestjs/swagger");
class IUser {
}
exports.IUser = IUser;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IUser.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IUser.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], IUser.prototype, "access_token", void 0);
class NotFoundResponse {
}
exports.NotFoundResponse = NotFoundResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ default: 404 }),
    __metadata("design:type", Number)
], NotFoundResponse.prototype, "status_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], NotFoundResponse.prototype, "message", void 0);
class UploadImageResponse {
}
exports.UploadImageResponse = UploadImageResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UploadImageResponse.prototype, "imageUrl", void 0);
class FileType {
}
exports.FileType = FileType;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], FileType.prototype, "file", void 0);
//# sourceMappingURL=index.js.map