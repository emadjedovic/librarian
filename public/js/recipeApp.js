// no JavaScript is run until the DOM is loaded and ready
$(document).ready(() => {
  // listen to a click event on a modal button
  $("#modal-button").click(() => {
    // clear the modal from any previous content.
    $(".modal-body").html("");
    // request data from /courses?format=json asynchronously
    $.get("/courses?format=json", (data) => {
      data.forEach((course) => {
        // Append each course to the modal.
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
            </div>`
        );
      });
    });
  });
});
