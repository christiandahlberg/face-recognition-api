
const handleRegister = (req, res, db, bcrypt) => {
	const { name, email, password } = req.body;

	const saltRounds = 10;
	const salt = bcrypt.genSaltSync(saltRounds);
	const emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

    if (!name ||
        !email ||
        !password ||
        !emailPattern.test(email)) {
    	return res.status(400).json("Incorrect form submission (empty fields or wrong email structure)");
    }
    
	const hash = bcrypt.hashSync(password, salt);

	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email.toLowerCase()
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					name: name,
					email: loginEmail[0],
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})

	.catch(err => res.status(400).json('Unable to register.'))

}

module.exports = {
  handleRegister: handleRegister
};