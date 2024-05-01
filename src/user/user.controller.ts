import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import {UserService} from "@user/user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(@Body() dto) {
        return this.userService.save(dto);
    }

    @Get(':idOrEmail')
    findOneUser(@Param('idOrEmail') idOrEmail: string) {
        return this.userService.findOne(idOrEmail);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: string) {
        return this.userService.delete(id);
    }
}
