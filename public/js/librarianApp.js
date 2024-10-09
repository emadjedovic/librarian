// no JavaScript is run until the DOM is loaded and ready
$(document).ready(() => {
  console.log("JWT Token:", token); // Log the JWT token

  // Listen to a click event on the modal button
  $("#modal-button").click(() => {
    console.log("Modal button clicked. Fetching libraries...");

    // Clear the modal from any previous content.
    $(".modal-body").html("");

    // Check if the token is available
    if (!token) {
      $(".modal-body").append("<p>Please log in to view libraries.</p>");
      return;
    }

    // Request data from /api/libraries asynchronously
    $.ajax({
      url: "/api/libraries",
      type: "GET",
      headers: {
        Authorization: `Bearer ${token}` // Set the JWT token in the Authorization header
      },
      success: (results = {}) => {
        console.log("API Response:", results);
        let data = results.data;
        console.log("API Response:", data); // Log the API response
        
        // Check that the data object contains library information
        if (!data || !data.libraries || data.libraries.length === 0) {
          $(".modal-body").append("<p>No libraries available.</p>");
          return;
        }

        // Loop through library data and add elements to the modal
        data.libraries.forEach((library) => {
          $(".modal-body").append(
            `<div class="card mb-3">
              <div class="card-body">
                <h5 class="card-title fw-bold">
                  ${library.name}
                </h5>
                <p class="card-text text-muted">
                  <strong>Address:</strong> ${library.address}<br>
                  <strong>Phone:</strong> ${library.contact.phone || 'N/A'}<br>
                  <strong>Email:</strong> ${library.contact.email || 'N/A'}<br>
                  <strong>Website:</strong> <a href="${library.website || '#'}" target="_blank">${library.website ? library.website : 'N/A'}</a>
                </p>
              </div>
              <button class='${
                library.joined ? "btn btn-success" : "btn btn-light join-button"
              }' data-id="${library._id}"> ${library.joined ? "Joined" : "Join"}
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
  $(".join-button").click((event) => {
    let $button = $(event.target),
      libraryId = $button.data("id");

    // Send the join request with JWT in the Authorization header
    $.ajax({
      url: `/api/libraries/${libraryId}/join`,
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
