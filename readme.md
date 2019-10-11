*** Tiny App ***

Setup:

Clone this project from github "git@github.com:aimanaaw/tinyapp.git"

Go to "http://localhost:8080/urls";
The middleware is set to listen to PORT: 8080 for connections

This app requires the following dependencies:
bcrypt: version 2.0.0
body-parser: version 1.19.0
cookie-session: version 1.3.3
ejs: version 2.7.1
express: version 4.17.1
Please install these dependencies using npm in your project folder.


Purpose: Allow users to shorten their URLs. This technique is usually used in websites such as Twitter which have a character limitation

Functionality:
Allows a user to shorten their URL

Allows users to create accounts.
Registered user can do the following:
>Login/Logout
>Shorten URLs and add it to a database of URLs
>Each user can create a list of URLs (Shortened and original)
>Users who are not registered and/or logged-in are not able to access the list

Screenshots of the app:

!["Creating a URL"](https://github.com/aimanaaw/tinyapp/blob/master/screenshots/Creating%20a%20URL.png)
!["Creating a new URL"](https://github.com/aimanaaw/tinyapp/blob/master/screenshots/Creating%20a%20new%20shortURL.png)
!["Creating a user with empty fields"](https://github.com/aimanaaw/tinyapp/blob/master/screenshots/Creating%20a%20user%20with%20empty%20fields.png)
!["URLs homepage"](https://github.com/aimanaaw/tinyapp/blob/master/URLs%20-%20Homepage.png)
!["Error message from empty fields"](https://github.com/aimanaaw/tinyapp/blob/master/screenshots/Error%20message%20from%20the%20empty%20fields%20in%20the%20registration%20page.png)