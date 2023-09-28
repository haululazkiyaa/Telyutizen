import Swal from "sweetalert2";
import { TimeDifference } from "@/components/fragment/TimeDifference";

export const notification = () => {
  let data: any = [];

  fetch("/api/homework/data")
    .then((res) => res.json())
    .then((res) => {
      data = res.data;
      let htmlContent: any = "<div>";
      for (let i of res.data) {
        if (TimeDifference(i.homeworkDeadline) <= 3) {
          htmlContent += `<p>ℹ️ ${i.homeworkTitle}</p>`;
        }
      }
      htmlContent += "</div>";

      Swal.fire({
        title: "Deadline Tugas Sudah Dekat!",
        icon: "warning",
        html: htmlContent,
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Oke!',
        confirmButtonAriaLabel: "",
        cancelButtonText: "",
        cancelButtonAriaLabel: "",
      });
    });
};
