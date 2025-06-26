import Swal from "sweetalert2";

/**
 * Reusable confirmation dialog
 * @param {Object} options
 * @param {string} options.confirmButtonText - Text for the confirm button (e.g. "Yes, delete it!")
 * @param {string} options.successTitle - Title after success (e.g. "Deleted!")
 * @param {string} options.successText - Text after success (e.g. "Your item has been deleted.")
 * @returns {Promise<boolean>} - true if confirmed, false otherwise
 */
const confirmDialog = async ({
  confirmButtonText = "Yes, confirm!",
  successTitle = "Done!",
  successText = "Action completed successfully.",
}) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
  });

  if (result.isConfirmed) {
    await Swal.fire(successTitle, successText, "success");
    return true;
  }

  return false;
};

export default confirmDialog;
