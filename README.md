# ConsoleTakeHome

Here's the console take home, sorry for not doing constant git commits I didn't realize I had to. Was a lot of fun doing this.

##What I used
TS frontend and backend. I used pocketbase for the databse, let me know if you want to run it locally I can help you set it up its pretty simple but you're gonna need my login for the auth.

##General thought process
I started out setting up frontend backend and the database. The database took a bit to setup and figure out (I had previously used it and since changed their api and docs). Once they were all up and running individually I connected them, made sure frontend can reach backend and vice versa and checked if frontend can upload some given values into the database. Everything was able to communicate with everything else so I set up a basic UI (basically just tables showing the data, having them be collapseable and some basic input and multiselect boxes). Had the data of a policy flow through to the backend and stored in the database. Once create was done, implementing remove and modify was pretty straightforward which were finished around the 4 hour mark. At that point I had a functioning product and an ugly UI so I spent the next two hours trying to figure out CSS and making things look nice, and the last hour on commenting and cleaning up code where possible. Total time spent: ~7hrs. 4 hours on functionality, 2 hours on design, 1 hour on reviewing, comments and sanity checks.
