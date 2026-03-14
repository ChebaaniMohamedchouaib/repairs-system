import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
const { Client, LocalAuth } = require('whatsapp-web.js');
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: any;
  private readonly logger = new Logger('WhatsAppService'); // اسم أنيق في السجل

  onModuleInit() {
    this.initializeClient();
  }

  initializeClient() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.client.on('qr', (qr) => {
      this.logger.log('📱 يرجى مسح كود QR التالي لربط واتساب المحل:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.logger.log('✅ واتساب Houba Phone متصل وجاهز لإرسال الإشعارات!');
    });

    this.client.on('disconnected', (reason) => {
      this.logger.warn('⚠️ انقطع اتصال الواتساب: ' + reason);
      this.client.initialize(); // إعادة الاتصال التلقائي
    });

    this.client.initialize();
  }

  async sendMessage(phone: string, message: string) {
    if (!phone) return; // حماية إضافية إذا كان الرقم فارغاً

    try {
      // 1. تنظيف ومعالجة الرقم الجزائري
      let cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '213' + cleanPhone.substring(1);
      } else if (!cleanPhone.startsWith('213')) {
        cleanPhone = '213' + cleanPhone;
      }

      // 2. التحقق من وجود الرقم في واتساب بصمت
      const numberDetails = await this.client.getNumberId(cleanPhone); 

      if (!numberDetails) {
        // رسالة تحذيرية صفراء بدلاً من خطأ أحمر مزعج
        this.logger.warn(`الرقم ${phone} غير مسجل في الواتساب. تم تجاوز الإرسال.`);
        return; 
      }

      // 3. الإرسال الفعلي
      const finalWhatsAppId = numberDetails._serialized;
      await this.client.sendMessage(finalWhatsAppId, message);
      
      // رسالة نجاح خضراء وأنيقة
      this.logger.log(`📩 تم إرسال إشعار بنجاح إلى: ${phone}`);
      
    } catch (error) {
      this.logger.error(`❌ خطأ في إرسال الواتساب: ${error.message}`);
    }
  }
}