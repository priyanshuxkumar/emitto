# **Emitto**

**Emitto** is a developer-first Notification API that lets you send **Emails**, **SMS** with ease. Built for modern applications, Emitto is scalable, reliable, and plug-and-play.

---

## **Features**

### **Core Functionality**
  - **Unified API** for Email and SMS notifications
  - **Event-Driven Architecture** powered by Kafka for massive scale
  - **API Key-based Authentication** with Redis caching for lightning-fast requests

### **Advanced Capabilities**
  - **Smart Queuing System** with automatic retries and dead-letter handling
  - **Email Templating Engine** with custom branding support
  - **NPM SDK** for instant integration into any JavaScript project

### **Developer Experience**
  - **Comprehensive Dashboard** for see uses
  - **Real-time Status Updates** and delivery confirmations
  - **Plug-and-play Setup** with minimal configuration required

---

## **How It Works**

### **Quick Start Guide**

1. **Install the SDK** in your project:
   ```bash
   npm install emitto
   ```

2. **Initialize the client**
   ```javascript
   import { Emitto } from "emitto";

   const emitto = new Emitto('nt_111222333');

   (async function() {
        const response = await emitto.emails.send({
            from: 'example@emitto.com',
            to: 'example@gmail.com',
            subject: 'Testing Email from emitto',
            html: '<strong>hello world!</strong>'
        });
        console.log(`Email Response: ${response}`);
   })();
   ```

## **Built With**

  - **[Next.js](https://nextjs.org/)**
  - **[Tailwind CSS](https://tailwindcss.com/)**
  - **[Shadcn/UI](https://ui.shadcn.com/)**
  - **[Node.js](https://nodejs.org/)**
  - **[Express.js](https://expressjs.com/)**
  - **[Redis](https://redis.io/)**
  - **[Apache Kafka](https://kafka.apache.org/)**