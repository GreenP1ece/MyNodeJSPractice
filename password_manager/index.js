import bcrypt from "bcrypt";
import promptModule from "prompt-sync";
import {MongoClient} from "mongodb";

const prompt = promptModule();

const dbUrl = "mongodb://localhost:27017";
const client = new MongoClient(dbUrl);
const dbName = "passwordManager";

let hasPasswords = false;
let passwordsCollection, authCollection;

const main = async () => {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB server");
        const db = client.db(dbName);
        passwordsCollection = db.collection("passwords");
        authCollection = db.collection("auth");
        const hashedPassword = await authCollection.findOne({type: "auth"});
        hasPasswords = !!hashedPassword;
    } catch (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);        
    }
};

const saveNewPassword = async (password) => {
    const hash = bcrypt.hashSync(password, 10);
    await authCollection.insertOne({type: "auth", hash});
    console.log("Password saved successfully.");
    await showMenu();
};

const compareHashedPassword = async (inputPassword) => {
    const { hash } = await authCollection.findOne({type: "auth"});
    if (!hash) {
        return new Error("No stored data found.");
    }
    return await bcrypt.compare(inputPassword, hash);
}

const promptNewPassword = async () => {
    const response = prompt("Enter a main password: ");
    return saveNewPassword(response);
};

const promptOldPassword = async () => {
    let verified = false;
    while (!verified) {
        const response = prompt("Enter your password: ");
        const result = await compareHashedPassword(response);
        if (result) {
            console.log("Password verified.");
            verified = true;
            showMenu();
        } else {
            console.log("Password incorrect. Try again.");
        }
    }
};

const viewPasswords = async() => {
    const passwords  = await passwordsCollection.find({}).toArray();
    passwords.forEach(({source, password}, index) => {
        console.log(`${index + 1}. ${source}: ${password}`);
    });
    showMenu();
};

const showMenu = async () => {
    console.log(`
        1. View passwords
        2. Manage new password
        3. Verify password
        4. Exit
    `);
    const response = prompt(">");
    
    switch (response) {
        case "1": await viewPasswords(); break;
        case "2": await promptManageNewPassword(); break;
        case "3": await promptOldPassword(); break;
        case "4": process.exit();
        default: 
            console.log("Invalid option. Try again.");
            await showMenu();
    }
};

const promptManageNewPassword = async () => {
    const source = prompt("Enter name for password: ");
    const password = prompt("Enter password to save: ");
    await passwordsCollection.findOneAndUpdate(
        {source},
        {$set: {password} },
        {
            returnDocument: "after",
            upsert: true
        }
    );
    console.log("Password saved.");
    await showMenu();
};

await main();
if (!hasPasswords) promptNewPassword();
else promptOldPassword();