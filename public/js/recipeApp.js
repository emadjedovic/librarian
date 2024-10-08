// no JavaScript is run until the DOM is loaded and ready
$(document).ready(() => {
  const apiToken = $("#apiToken").data("token");
  console.log("API Token:", apiToken); // Log the API token
  // listen to a click event on a modal button
  $("#modal-button").click(() => {
    console.log("Modal button clicked. Fetching courses...");
    // clear the modal from any previous content.
    $(".modal-body").html("");
    // request data from /courses?format=json asynchronously
    $.get(`/api/courses?apiToken=${apiToken}`, (results = {}) => {
      console.log("API Response:", results);
      let data = results.data;
      console.log("API Response:", data); // Log the API response
      // Check that the data object contains course information
      if (!data || !data.courses) {
        $(".modal-body").append("<p>No courses available.</p>");
        return;
      }
      // Loop through course data, and add elements to modal
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
    }).then(() => {
      addJoinButtonListener();
    });
  });
});

let addJoinButtonListener = () => {
  const apiToken = $("#apiToken").data("token");
  $(".join-button").click((event) => {
    let $button = $(event.target),
      courseId = $button.data("id");
    $.get(`/api/courses/${courseId}/join?apiToken=${apiToken}`, (results = {}) => {
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
    });
  });
};
