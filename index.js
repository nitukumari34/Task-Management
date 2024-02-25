const express = require('express');
const app = express();
const PORT = 8080;
const connectToDB = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const Task = require('./models/Task');
const User = require('./models/User');
require('dotenv').config();
const twilio = require('twilio');


connectToDB();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
    cors({
        origin: 'http://localhost:3000',
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
)

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api', routes);
app.use((err, req, res, next) => {
    res.status(500).send('Something went wrong!');
  });

  cron.schedule('0 0 * * *', async () => {
    try {
        
        const overdueTasks = await Task.find({ due_date: { $lt: new Date() } });

        
        overdueTasks.forEach(async (task) => {
           
            task.priority = Math.max(task.priority - 1, 0);
            await task.save();
        });

        console.log('Task priorities updated successfully based on due dates.');
    } catch (error) {
        console.error('Error updating task priorities:', error);
    }
});




const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const myPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

cron.schedule('0 * * * *', async () => {
    try {
      
        const users = await User.find().sort({ priority: 1 });

        for (const user of users) {
          
            const overdueTasks = await Task.find({ assigned_to: user._id, due_date: { $lt: new Date() } });

         
            if (overdueTasks.length > 0) {
        
                await twilioClient.calls.create({
                    url: 'http://your-webhook-url', 
                    to: user.phone,
                    from: myPhoneNumber
                    
                });

                console.log(`Voice call initiated to user ${user.name} at ${user.phone_number}.`);
             
                break;
            }
        }
    } catch (error) {
        console.error('Error initiating voice calls:', error);
    }
});



app.listen(PORT, (req, res) => {
    console.log( `Server is running on port ${PORT}`);
});
