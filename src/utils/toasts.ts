import Swal from 'sweetalert2'

export function dialog(title: string, message: string) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d33',
    })
  }


  export class ResponseDialog {
    static wait(message: string) {
        Swal.fire({
          title: message,
          allowOutsideClick: false,
        })
        Swal.showLoading()
      }

      static dismissLoading() {
        Swal.close()
      }
  }



