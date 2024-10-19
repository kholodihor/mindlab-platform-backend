import { Controller } from '@nestjs/common';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
