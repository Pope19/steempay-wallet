/*jslint browser: true*/
/*global SecureLS, $, steem, localStorage, window, document*/
//check if user is logged in
if (localStorage.getItem('logged_in') === "1") {
    window.location.href = "index.html";
}
//encrypting localstorage
var ls = new SecureLS({
    encodingType: 'aes'
});

$(document).ready(function () {
    $(".loader").fadeOut("fast");
    $("#login_button").click(function () {
        //fade in loader screen
        $("#login_status").text("loading...");
        $(".loader").fadeIn("fast");
        //hide error if it is showing
        $("#login_error").hide();
        $("#login_status").text("validating...");
        //get username and password from login form
        var account = $("#login_username").val().toLowerCase(),
            password = $("#login_password").val(),
            //api call to check if valid format
            isValid = steem.utils.validateAccountName(account);
        //check if name is valid format, else show error
        if (isValid === null) {
            //check if user exists, else show error
            $("#login_status").text("looking up user...");
            steem.api.lookupAccountNames([account], function (err, result) {
                if (err) {
                    //log error to user
                    error("login_error", err);
                }
                if (result[0] !== null) {
                    //if exists, get account user object
                    $("#login_status").text("user found...");
                    steem.api.getAccounts([account], function (err, response) {
                        $("#login_status").text("getting account...");
                        //get active pubkey to check against key that is generated below
                        var activePubVerify = response[0].active.key_auths[0][0],
                            //generate active keys from account username/password
                            keys = steem.auth.getPrivateKeys(account, password, ["active", "memo"]),
                            activePub = keys.activePubkey,
                            activePriv = keys.active,
                            memo = keys.memo;
                        $("#login_status").text("generating keys...");
                        //check if generated key is the same as known key for account
                        if (activePub === activePubVerify) {
                            $("#login_status").text("validating keys...");
                            //keys match - correct username/password combo
                            //save active priv key and username into local storage
                            $("#login_status").text("encrypting keys...");
                            ls.set("key", activePriv); // set key1
                            ls.set("memo", memo);
                            localStorage.setItem("user", account);
                            localStorage.setItem("logged_in", "1");
                            //send user to wallet
                            window.location.href = "index.html";
                            $(".loader").fadeOut("slow");
                        } else {
                            //keys do not match - incorrect username/password combo
                            error("login_error", "password does not match this user");
                        }
                    });
                } else {
                    //user does not exist
                    error("login_error", "user does not exist");
                }
            });
        } else {
            //name is invalid format
            error("login_error", isValid.toLocaleLowerCase());
        }
    });
});
