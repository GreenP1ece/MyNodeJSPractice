import prompt from "prompt";
import { createObjectCsvWriter } from "csv-writer";

prompt.start();
prompt.message = "";

class Person {
  constructor(name = "", number = "", email = "", createdAt = new Date().toISOString()) {
    this.name = name;
    this.number = number;
    this.email = email;
    this.createdAt = createdAt;
  }

async saveToCSV() {
    try {
        const {name, number, email, createdAt} = this;

        await csvWriter.writeRecords([{name, number, email, createdAt}]);
        console.log('Contact saved successfully.');
        } catch (error) {
            console.error('Error saving contact:', error);
        }
    }
}
const numberMatch = new RegExp(/^[0-9+\-() ]+$/);
const validateNumber = number =>
{
    if (number.length < 7 || number.length > 15) return false;
    if (!numberMatch.test(number)) return false;
    return true;
}

const emailMatch = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const validateEmail = email =>
{
    if (!emailMatch.test(email)) return false;
    return true;
}
//     new Promise((resolve) => readline.question(message, resolve));

const csvWriter = createObjectCsvWriter({
  path: './contacts.csv',
  append: true,
  header: [
    { id: 'name', title: 'Name' },
    { id: 'number', title: 'Phone Number' },
    { id: 'email', title: 'Email Address' },
    { id: 'createdAt', title: 'Created At' }
  ]
});

const startApp = async () => {
    const questions = [
        { name: 'name', message: 'Enter your name: ' },
        { name: 'number', message: 'Enter your phone number: ' },
        { name: 'email', message: 'Enter your email address: ' }
    ];
    const validatedQuestions = [
        questions[0],
        { ...questions[1], validator: validateNumber, warning: 'Please enter a valid phone number (7-15 digits, may include +, -, (, ), and spaces).' },
        { ...questions[2], validator: validateEmail, warning: 'Please enter a valid email address.' }
    ];
        const results = await prompt.get(validatedQuestions);
        const person = new Person(results.name, results.number, results.email, new Date ().toISOString());
        await person.saveToCSV();

        const {again} = await prompt.get({ name: 'again', message: 'Do you want to add another contact? (y/n): ' });

        if (again.toLowerCase() === 'y') await startApp();
    };

startApp();