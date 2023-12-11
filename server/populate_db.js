// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/users')

let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];
function tagCreate(name, creator) {
  let tag = new Tag({ name: name, creator:creator });
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time) {
  answerdetail = {text:text};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

function userCreate(username, email, dateJoined) {
  userDetail = {
    username: username,
    email: email,
    password: 'password',
    reputation: 0,
    date_joined: dateJoined,
    is_admin: false
  }
  if (dateJoined != false) userDetail.date_joined = dateJoined;
  let user = new User(userDetail);
  return user.save();
}

async function createQuestions() {

  let hamkalo = await userCreate('hamkalo', 'hamkalo@fake_so.com', new Date('2020-10-10'));
  let azad = await userCreate('azad', 'azad@fake_so.com', new Date('2020-10-11'));
  let abaya = await userCreate('abaya', 'abaya@fake_so.com', new Date('2020-10-12'));
  let alia = await userCreate('alia', 'alia@fake_so.com', new Date('2020-10-13'));
  let sana = await userCreate('sana', 'sana@fake_so.com', new Date('2020-10-14'));
  let Joji_John = await userCreate('Joji_John', 'Joji_John@fake_so.com', new Date('2020-10-15'));
  let saltyPeter = await userCreate('saltyPeter', 'saltyPeter@fake_so.com', new Date('2020-10-16'));

  let independentCoder = await userCreate('independentCoder', 'independentCoder@fake_so.com', new Date('2020-10-10'));
  let pythonSnake = await userCreate('pythonSnake', 'pythonSnake@fake_so.com', new Date('2021-10-11'));
  let boaConstrictor = await userCreate('boaConstrictor', 'boaConstrictor@fake_so.com', new Date('2020-10-12'));
  let stopCoder = await userCreate('stopCoder', 'stopCoder@fake_so.com', new Date('2020-10-13'));
  let allergicCoder = await userCreate('allergicCoder', 'allergicCoder@fake_so.com', new Date('2020-10-14'));
  let freeCoder = await userCreate('FreeCoder', 'FreeCoder@fake_so.com', new Date('2020-09-12'));
  let reptileCoder = await userCreate('ReptileCoder', 'ReptileCoder@fake_so.com', new Date('2017-11-09'));
  let fearlessCoder = await userCreate('FearlessCoder', 'FearlessCoder@fake_so.com', new Date('2019-12-05'));
  let exitCoder = await userCreate('ExitCoder', 'ExitCoder@fake_so.com', new Date('2018-06-12'));
  let sneezingCoder = await userCreate('SneezingCoder', 'SneezingCoder@fake_so.com', new Date('2022-05-19'));
  

  let voidCoder = await userCreate('voidCoder', 'voidCoder@fake_so.com', new Date('2020-11-01'));
  let lunarCoder = await userCreate('lunarCoder', 'lunarCoder@fake_so.com', new Date('2018-09-22'));
  let streamCoder = await userCreate('streamCoder', 'streamCoder@fake_so.com', new Date('2019-05-07'));
  let softCoder = await userCreate('softCoder', 'softCoder@fake_so.com', new Date('2020-12-03'));
  let undeadCoder = await userCreate('undeadCoder', 'undeadCoder@fake_so.com', new Date('2022-02-14'));
  let amongOSLoverPogSauce = await userCreate('AmongOSLoverPogSauce', 'AmongOSLoverPogSauce@fake_so.com', new Date('2017-12-14'));
  

  let t1 = await tagCreate('react', Joji_John);
  let t2 = await tagCreate('javascript', Joji_John);
  let t3 = await tagCreate('android-studio', saltyPeter);
  let t4 = await tagCreate('shared-preferences', saltyPeter);
  let t5 = await tagCreate('nodejs', sneezingCoder);
  let t6 = await tagCreate('mongodb', voidCoder);
  let t7 = await tagCreate('python', lunarCoder);
  let t8 = await tagCreate('express', streamCoder);



  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', hamkalo, false);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', azad, false);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', abaya, false);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', alia, false);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', sana, false);
  await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], Joji_John, false, false);
  await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], saltyPeter, false, 121);

  let t9 = await tagCreate('independencejs', independentCoder);
  let t10 = await tagCreate('viper', pythonSnake);
  let t11 = await tagCreate('boa', boaConstrictor);
  let t12 = await tagCreate('stoplang', stopCoder);




  let a11 = await answerCreate('Independence.js is the latest cutting-edge framework that claims to make your code independent of logic. It runs on the sheer power of freedom and patriotism. Are you ready to liberate your code?', independentCoder, new Date('2020-10-10'));

  let a12 = await answerCreate('Viper is the programming language of the future, designed for reptilian developers. It features hissing-based syntax and slithering optimizations. Is your code ready to crawl to success with Viper?', pythonSnake, new Date('2021-10-11'));

  let a13 = await answerCreate('Boa is a language inspired by the constricting power of boas. Its unique feature is squeezing out bugs from your code. Are you prepared to embrace the constrictor language?', boaConstrictor, new Date('2020-10-12'));

  let a14 = await answerCreate('StopLang is the language that puts an end to your programming worries. Its syntax includes "STOP" and "HALT" for efficient code termination. Are you ready to stop programming in any other language?', stopCoder, new Date('2020-10-13'));

  let a15 = await answerCreate('Introducing SneezScript, the language designed for programmers with allergies. Instead of semicolons, you end your statements with achoos. Are you prepared for the sniffly syntax of SneezScript?', allergicCoder, new Date('2020-10-14'));

  await questionCreate('What makes Independence.js so independent?', 'I heard Independence.js is all about making your code independent, but how does it achieve such freedom? Does it come with a patriotic theme song?', [t1, t9], [a11], freeCoder, new Date('2020-09-12'), false);

  await questionCreate('Why should I switch to Viper?', 'Viper claims to be the language of reptilian developers. How does coding in Viper compare to other languages? Do I need to hiss while writing code?', [t2, t10], [a12], reptileCoder, new Date('2017-11-09'), false);

  await questionCreate('Is Boa really squeezing bugs out of my code?', 'Boa promises to squeeze bugs out of my code. How effective is the constrictor language, and can it handle bugs of all sizes? Are there any risks of getting bitten?', [t3, t11], [a13], fearlessCoder, new Date('2019-12-05'), false);
  await questionCreate('How do I stop coding with StopLang?', 'I want to quit coding in other languages and embrace StopLang. Can someone guide me on how to halt my current programming endeavors and start with StopLang? Are there any exit strategies?', [t4, t12], [a14], exitCoder, new Date('2018-06-12'), false);
  await questionCreate('Has anyone tried coding in SneezScript?', 'SneezScript sounds intriguing with its achoo-based syntax. Has anyone tried coding in this sniffly language? What are the benefits of writing code while battling allergies?', [t5, t9], [a15], sneezingCoder, new Date('2022-05-19'), false);

  let t13 = await tagCreate('nullscript', voidCoder);
  let t14 = await tagCreate('moonlang', lunarCoder);
  let t15 = await tagCreate('hululang', streamCoder);
  let t16 = await tagCreate('fluffycss', softCoder);
  let t17 = await tagCreate('zombielang', undeadCoder);

  let a16 = await answerCreate('NullScript is the only language that embraces the power of nothingness. Can someone guide me on how to code with NullScript? Do I need to declare variables as "void" to harness its true null power?', voidCoder, false);

  let a17 = await answerCreate('MoonLang is the language that takes your code to the moon and beyond. How does coding in MoonLang differ from coding on Earth? Are there any gravitational syntax rules to follow?', lunarCoder, false);

  let a18 = await answerCreate('HuluLang is the streaming language that brings your code to life. Can someone share their experience with coding in HuluLang? Does it come with a binge-watching debugger?', streamCoder, false);

  let a19 = await answerCreate('FluffyCSS is the stylesheet language that adds a touch of softness to your UI. How does FluffyCSS make user interfaces fluffier? Can I customize the fluffiness level?', softCoder, false);

  let a20 = await answerCreate('ZombieLang is the undead language for resurrecting legacy code. How effective is ZombieLang in bringing dead code back to life? Are there any risks of code biting?', undeadCoder, false);

  await questionCreate('How null is NullScript?', 'I heard NullScript is all about the power of nothingness. Can someone provide examples of how to code in NullScript? Is it possible to code without writing any lines of code?', [t6, t13], [a16], voidCoder, false, false);

  await questionCreate('Coding on the moon with MoonLang', 'MoonLang promises to take your code to the moon. How does coding on the moon differ from Earth? Are there any interstellar coding challenges in MoonLang?', [t7, t14], [a17], lunarCoder, false, false);

  await questionCreate('Streaming code with HuluLang', 'HuluLang is the streaming language for coding. How does streaming code work in HuluLang? Can I pause and resume my code execution like a binge-watched series?', [t8, t15], [a18], streamCoder, false, false);

  await questionCreate('Making UI fluffier with FluffyCSS', 'FluffyCSS claims to add softness to user interfaces. Can someone demonstrate how to use FluffyCSS to make UI elements fluffier? Is there a recommended fluffiness level for buttons?', [t9, t16], [a19], softCoder, false, false);

  await questionCreate('Reviving code with ZombieLang', 'ZombieLang is the undead language for resurrecting code. How effective is ZombieLang in reviving dead code? Are there any precautions to take when dealing with undead code?', [t10, t17], [a20], undeadCoder, false, false);
  await questionCreate('AmongOS', 'How do I activate AmongOS on i32 core 16GB RAM?', [t11, t13], false, amongOSLoverPogSauce, new Date('2017-12-14'), false);
}


const populate = async () => {
  await createQuestions()
  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');
