
 //Track the UID of the current user. 
var currentUid = null;  
firebase.auth().onAuthStateChanged(function(user) {  
 // onAuthStateChanged listener triggers every time the user ID token changes.  
 // This could happen when a new user signs in or signs out.  
 // It could also happen when the current user ID token expires and is refreshed.  
 if (user && user.uid != currentUid) {  
  // Update the UI when a new user signs in.  
  // Otherwise ignore if this is a token refresh.  
  // Update the current user UID.  
  currentUid = user.uid;  
  //document.body.innerHTML = '<h4>Hello ' + user.displayName; 
    document.getElementById("username").innerHTML = user.displayName
    document.getElementById("username1").innerHTML = 'Hello '+user.displayName+'!'; 

 } else {  
  // Sign out operation. Reset the current user UID.  
  currentUid = null;  
 }  
}); 