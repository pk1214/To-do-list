exports.getDate = function () {
  const today = new Date(); // Create a new date object with the current date and time
  const currentDay = today.getDay(); // Get the current day of the week

  let option = {
    weekday: "long", // Display the full weekday name
    day: "numeric", // Display the day of the month as a numeric value
    month: "long", // Display the full month name
  };

  return today.toLocaleDateString("en-US", option); // Return the date as a formatted string
};

exports.getDay = function () {
  const today = new Date(); // Create a new date object with the current date and time
  const currentDay = today.getDay(); // Get the current day of the week

  let option = {
    weekday: "long", // Display the full weekday name
  };

  return today.toLocaleDateString("en-US", option); // Return the day of the week as a formatted string
};
