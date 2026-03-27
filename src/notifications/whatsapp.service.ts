import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
const { Client, LocalAuth } = require('whatsapp-web.js');
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: any;
  private readonly logger = new Logger('WhatsAppService');

  onModuleInit() {
    this.initializeClient();
  }

  initializeClient() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        // 🛠️ تعديلات جوهرية لحل مشكلة الانهيار في ويندوز
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage', // مهم جداً لويندوز
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu', // إيقاف المعالج الرسومي لتقليل الضغط
        ],
        // إذا استمر الخطأ، يمكنك إلغاء التعليق عن السطر التالي وتحديد مسار الكروم يدوياً:
        // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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
      // تجنب إعادة التشغيل اللانهائي إذا كان السبب هو المتصفح
      setTimeout(() => this.client.initialize(), 5000); 
    });

    // إضافة مستمع للأخطاء لمنع انهيار السيرفر بالكامل
    this.client.on('auth_failure', msg => {
        this.logger.error('❌ فشل المصادقة: ' + msg);
    });

    this.client.initialize().catch(err => {
        this.logger.error('❌ فشل بدء تشغيل الواتساب: ' + err.message);
    });
  }

  async sendMessage(phone: string, message: string) {
    if (!phone || !this.client) return;

    try {
      let cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '213' + cleanPhone.substring(1);
      } else if (!cleanPhone.startsWith('213')) {
        cleanPhone = '213' + cleanPhone;
      }

      const numberDetails = await this.client.getNumberId(cleanPhone); 

      if (!numberDetails) {
        this.logger.warn(`الرقم ${phone} غير مسجل في الواتساب.`);
        return; 
      }

      await this.client.sendMessage(numberDetails._serialized, message);
      this.logger.log(`📩 تم إرسال إشعار بنجاح إلى: ${phone}`);
      
    } catch (error) {
      this.logger.error(`❌ خطأ في إرسال الواتساب: ${error.message}`);
    }
  }
}