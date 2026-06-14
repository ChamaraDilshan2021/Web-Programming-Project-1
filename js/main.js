function updateDateTime() {
    var now = new Date();

    var days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];

    var dayName = days[now.getDay()];
    var date    = now.getDate();
    var month   = months[now.getMonth()];
    var year    = now.getFullYear();

    var hours   = now.getHours().toString().padStart(2, "0");
    var minutes = now.getMinutes().toString().padStart(2, "0");
    var seconds = now.getSeconds().toString().padStart(2, "0");

    var dateStr = dayName + ", " + date + " " + month + " " + year;
    var timeStr = hours + ":" + minutes + ":" + seconds;

    $(".liveDate").text(dateStr + "  |  " + timeStr);
}

function setMinDates() {
    var today = new Date().toISOString().split("T")[0];
    $("input[type='date']").each(function () {
        if (!$(this).attr("min")) {
            $(this).attr("min", today);
        }
    });
   
    $("#departure-date, #dep-date").val(today);
}

 
function setActiveNav() {
    var page = window.location.pathname.split("/").pop() || "index.html";
    $("nav ul li a").each(function () {
        var href = $(this).attr("href");
        if (href === page) {
            $(this).addClass("active");
        }
    });
}

//  Form Validation - contact.html 
function initContactForm() {
    $("#contact-form").on("submit", function (e) {
        e.preventDefault();
        var valid = true;

        // Name
        var name = $("#c-name").val().trim();
        if (name.length < 2) {
            showError("c-name", "Please enter your full name.");
            valid = false;
        } else {
            clearError("c-name");
        }

        // Email
        var email = $("#c-email").val().trim();
        var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailReg.test(email)) {
            showError("c-email", "Please enter a valid email address.");
            valid = false;
        } else {
            clearError("c-email");
        }

        // Subject
        if ($("#c-subject").val() === "") {
            showError("c-subject", "Please select a subject.");
            valid = false;
        } else {
            clearError("c-subject");
        }

        // Message
        var msg = $("#c-message").val().trim();
        if (msg.length < 10) {
            showError("c-message", "Message must be at least 10 characters.");
            valid = false;
        } else {
            clearError("c-message");
        }

        if (valid) {
            // Show success
            $("#form-success").slideDown(300);
            $("#contact-form")[0].reset();
            setTimeout(function () {
                $("#form-success").slideUp(300);
            }, 5000);
        }
    });
}

//  Form Validation - booking.html
function initBookingForm() {
    $("#booking-form").on("submit", function (e) {
        e.preventDefault();
        var valid = true;

        var fields = [
            { id: "b-fname",  msg: "First name is required." },
            { id: "b-lname",  msg: "Last name is required." },
            { id: "b-phone",  msg: "Phone number is required." },
            { id: "b-nic",    msg: "NIC / Passport is required." },
        ];

        fields.forEach(function (f) {
            if ($("#" + f.id).val().trim() === "") {
                showError(f.id, f.msg);
                valid = false;
            } else {
                clearError(f.id);
            }
        });

        // Phone validation
        var phone = $("#b-phone").val().trim();
        if (phone !== "" && !/^[\d\s\+\-]{7,15}$/.test(phone)) {
            showError("b-phone", "Enter a valid phone number.");
            valid = false;
        }

        // Email
        var email = $("#b-email").val().trim();
        var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email !== "" && !emailReg.test(email)) {
            showError("b-email", "Enter a valid email address.");
            valid = false;
        }

        // Seat class
        if ($("#b-class").val() === "") {
            showError("b-class", "Please select a seat class.");
            valid = false;
        } else {
            clearError("b-class");
        }

        if (valid) {
            $("#booking-success").slideDown(300);
            $("html, body").animate({ scrollTop: 0 }, 400);
            $(this).closest(".formCard").hide();
        }
    });
}

//  Helpers 
function showError(id, msg) {
    $("#" + id).addClass("invalid");
    $("#" + id + "-err").text(msg).addClass("show");
}

function clearError(id) {
    $("#" + id).removeClass("invalid");
    $("#" + id + "-err").removeClass("show");
}

// Clear error on input
$(document).on("input change", ".formField input, .formField select, .formField textarea", function () {
    $(this).removeClass("invalid");
    var id = $(this).attr("id");
    if (id) {
        $("#" + id + "-err").removeClass("show");
    }
});

//  Search Results Filter - results.html
function initResultsFilter() {
    $("#filter-class").on("change", function () {
        var val = $(this).val();
        $(".trainRow").each(function () {
            if (val === "all" || $(this).data("class") === val) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    
}

//  Seat counter
function initSeatCounter() {
    $(".qtyBtn").on("click", function () {
        var target = $(this).data("target");
        var $input = $("#" + target);
        var val    = parseInt($input.val()) || 1;
        var action = $(this).data("action");

        if (action === "inc" && val < 6) {
            $input.val(val + 1);
        } else if (action === "dec" && val > 1) {
            $input.val(val - 1);
        }
        updateFare();
    });
}

function updateFare() {
    var seats = parseInt($("#b-seats").val()) || 1;
    var cls   = $("#b-class").val();
    var prices = { "1": 850, "2": 480, "3": 280 };
    var price  = prices[cls] || 0;
    var total  = seats * price;
    if (cls && price) {
        $("#fare-display").text("LKR " + total.toLocaleString()).closest(".fareBox").show();
    }
}

//  Document Ready 
$(document).ready(function () {
    setActiveNav();
    setMinDates();
    initContactForm();
    initBookingForm();
    initResultsFilter();
    initSeatCounter();
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Fare update on class change
    $("#b-class").on("change", updateFare);
});
