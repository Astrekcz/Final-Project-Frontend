
Frontend structure (suggestion):
-We can adjust this-specify in more details

Homepage:
-login (as button?)
-register (as button?)
-list of books + searchbar field on top of list (anybody can type text into search field to find specific book)
-the list/table of books will show all entity fields, except bookId  (frontend feature, no need to adjust backend)
-when clicking on each book, it will redirect to subpage showing all existing reviews (with entity fields, without reviewIds), so we can see details: reviews and ratings and first name of reviewer
-if book does not have any reviews, there will be text: No reviews yet

Register:
-home (button?)
-entering fields: first name, last name, email, password + button for submitting
-if fields are ok (with correct format), message/window about successful registration will be shown  -> redirecting to home page (registered user is not logged in automatically)

Login:
-home (button?)
-entering fields: email + password  + button for submitting
-if login fails -> show message about invalid credentials, stay on the login page (clear the form)
-if login successful -> show message about successful login -> redirecting to home page


Logged in user:
-homepage with logged in user will show all books + will have fields/buttons:
*My reviews - > will show all user's reviews plus 2 buttons to each review: edit, delete
-> button for editing review: will show name of related book + option to adjust text of review & adjust rating (number) of review 
-> button for delete: will delete review
*Logout -> will logout user, redirect to homepage
*Delete account (for deleting user)
-optional feature: request admin to add specific book
-optional feature: possibility to change password

Logged in admin:
-homepage with logged in user will show logout option/button + 3 main buttons (e.g. in the middle os screen):
*add book
*view books -> will show all books, each book will have delete button (for deleting book)
*view users -> will show all users, each user will have delete button 
*view reviews -> will show all reviews, each will have delete button
-if admin logs out -> redirect to homepage (same as user logout)


