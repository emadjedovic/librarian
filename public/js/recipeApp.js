// no JavaScript is run until the DOM is loaded and ready
$(document).ready(() => {
  // Retrieve the JWT from localStorage (or wherever it's stored after user login)
  // const token = localStorage.getItem("jwtToken");
  console.log("JWT Token:", token); // Log the JWT token

  // Listen to a click event on the modal button
  $("#modal-button").click(() => {
    console.log("Modal button clicked. Fetching courses...");
    
    // Clear the modal from any previous content.
    $(".modal-body").html("");

    // Check if the token is available
    if (!token) {
      $(".modal-body").append("<p>Please log in to view courses.</p>");
      return;
    }

    // Request data from /api/courses asynchronously
    $.ajax({
      url: "/api/courses",
      type: "GET",
      headers: {
        Authorization: `Bearer ${token}` // Set the JWT token in the Authorization header
      },
      success: (results = {}) => {
        console.log("API Response:", results);
        let data = results.data;
        console.log("API Response:", data); // Log the API response
        
        // Check that the data object contains course information
        if (!data || !data.courses) {
          $(".modal-body").append("<p>No courses available.</p>");
          return;
        }

        // Loop through course data and add elements to the modal
        data.courses.forEach((course) => {
          $(".modal-body").append(
            `<div class="card mb-3">
              <div class="card-body">
                <h5 class="card-title fw-bold">
                  ${course.title}
                </h5>
                <p class="card-text text-muted">
                  ${course.description}
                </p>
              </div>
              <button class='${
                course.joined ? "btn btn-success" : "btn btn-light join-button"
              }' data-id="${course._id}"> ${course.joined ? "Joined" : "Join"}
              </button>
            </div>`
          );
        });
      }
    }).then(() => {
      addJoinButtonListener();
    });
  });
});

// Event listener to handle join button clicks
let addJoinButtonListener = () => {
  // const token = localStorage.getItem("jwtToken"); // Retrieve the JWT again
  $(".join-button").click((event) => {
    let $button = $(event.target),
      courseId = $button.data("id");

    // Send the join request with JWT in the Authorization header
    $.ajax({
      url: `/api/courses/${courseId}/join`,
      type: "GET",
      headers: {
        Authorization: `Bearer ${token}` // Set the JWT token in the Authorization header
      },
      success: (results = {}) => {
        let data = results.data;

        // Check whether the join action was successful, and modify the button.
        if (data && data.success) {
          $button
            .text("Joined")
            .addClass("btn-success")
            .removeClass("btn-light join-button");
        } else {
          $button.text("Try again");
        }
      }
    });
  });
};
