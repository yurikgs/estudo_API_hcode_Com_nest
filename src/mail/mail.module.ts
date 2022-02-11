import { MailService } from './mail.service';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { resolve } from 'path';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'


@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: Number(process.env.MAIL_PORT),
                    secure: false, //Nanuvem mudar para true(!)
                    auth: {
                        user:process.env.MAIL_USER,
                        pass:process.env.MAIL_PASS,
                    },
                },
                defaults: {
                    from: `Default Mailer Tester < ${process.env.MAIL_FROM} >`
                },
                template: {
                    dir: resolve(__dirname, 'templates'),
                    adapter: new PugAdapter(),
                    options: {
                        strict: true
                    },
                },
            })
        })
    ],
    controllers: [],
    providers: [
        MailService,
    ],
    exports: [
        MailService
    ]
})
export class MailModule { }
