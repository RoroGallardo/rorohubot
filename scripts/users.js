module.exports = function(robot) {
  const findBDay = (userToken, response) =>{
    if (userToken.length === '') return response.send('¡Oe no seai pillo, escribe un nombre!')
    var usr = userForToken(userToken, response).then(targetUser => {
              if (!targetUser) return
              response.send(`:balloon:   : ${targetUser.name}`)
            }).catch(err => robot.emit('error', err, response))
    console.log("funbday");
    console.log(usr);

 }

 const userForToken = (token, response) => {
   return usersForToken(token)
     .then(users => {
       console.log("userfortoken");
       let user
       if (users.length === 1) {
         user = users[0]
         if (typeof user.birthday === 'undefined' || user.birthday === null) {
           user.birthday = "";
         }
         console.log("usr for token :user" );
        // console.log(user);

       } else if (users.length > 1) {
         robot.messageRoom(`@${response.message.user.name}`, `Se más específico, hay ${users.length} personas que se parecen a: ${users.map(user => user.name).join(', ')}.`)
       } else {
         response.send(`Chaucha, no encuentro al usuario '${token}'.`)
         return null;
       }
       return user
     })
 }


     const usersForToken = token => {
       console.log("usersfortoken");
       console.log(token);
       return new Promise((resolve, reject) => {
         let user
         if (user = userForDName(token)) {
           return resolve(user)
         }
         if (robot.adapter.constructor.name === 'SlackBot') {
           userFromWeb(token).then(webUser => {
             if (webUser) {
               return resolve([webUser])
             } else {
               return resolve(robot.brain.usersForFuzzyName(token))
             }
           }).catch(reject)
         } else {
           user = robot.brain.usersForFuzzyName(token)
           resolve(user)
         }
       })
     }

     const userForDName = dname => {
       const users = robot.brain.users();
       var mapUsers =  Object.keys(users).map(key => users[key]);
       console.log("mapuss");
       console.log(mapUsers.length);
       mapUsers.forEach(function (usr) {
         console.log("\n USER");
         console.log(usr.real_name);
         var a = typeof usr.slack;

         
         /**var s =usr.slack;
         console.log("S");
         console.log(s);
         if(usr.profile.display_name ===dname){
           console.log("SIIII");
           return usr;
         }**/
       });
       return Object.keys(users).map(key => users[key]).find(user => dname === user.real_name);
     }

     robot.respond(/buscar userName (.*)/i, function(msg) {
       var uss =  robot.brain.users();
       var userToken = msg.match[1].split(' ')[0];//+" "+ msg.match[1].split(' ')[1];
       findBDay(userToken, msg);

     });



};
