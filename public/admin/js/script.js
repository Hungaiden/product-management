// bộ loc
const boxFilter = document.querySelector("[box-filter]");
if(boxFilter) {
    let url = new URL(location.href); // nhan ban url
    
    // BắT sự kiện onchange
    boxFilter.addEventListener("change", () => {
        const value = boxFilter.value;

        if(value) {
            url.searchParams.set("status", value);
        }
        else {
            url.searchParams.delete("status");
        }

        location.href = url.href;
    });

    // hiển thị lựa chọn mặc định
    const statusCurrent = url.searchParams.get("status");
    if(statusCurrent) {
        boxFilter.value = statusCurrent;
    };
}
// hết bộ lọc

//Tìm kiếm
const formSearch = document.querySelector("[form-search]");
if(formSearch) {
    let url = new URL(location.href);

    formSearch.addEventListener("submit",(event) => {
        event.preventDefault();
        const value = formSearch.keyword.value;

        if(value) {
            url.searchParams.set("keyword", value);
        }
        else {
            url.searchParams.delete("keyword");
        }
        
        location.href = url.href;
    });

    // hiển thị từ khoá mặc định
    const valueCurrent = url.searchParams.get("keyword");
    if(valueCurrent) {
        formSearch.keyword.value = valueCurrent;
    }
}
//Hết tìm kiếm

// Phân trang
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if(listButtonPagination.length > 0) { // nếu k tìm thấy nó trả ra mảng rỗng nên k dùng if
    let url = new URL(location.href) ; // nhẩn bản url

    listButtonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            if(page) {
                url.searchParams.set("page", page);
            }
            else {
                url.searchParams.delete("page");
            }
        
            location.href = url.href;
        })
    })
    // Hiển thị trạng thái active
    const pageCurrent = url.searchParams.get("page");
    const buttonCurrent = document.querySelector(`[button-pagination="${pageCurrent}"]`);
    if(buttonCurrent) {
        buttonCurrent.parentNode.classList.add("active");
    }
    
}
// Hết phân trang


// Đổi trạng thái
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
if(listButtonChangeStatus.length > 0) {
  listButtonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const itemId = button.getAttribute("item-id");
      const statusChange = button.getAttribute("button-change-status");
      const path = button.getAttribute("data-path");

      const data = {
        id: itemId,
        status: statusChange
      };

      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "success") {
            location.reload();
          }
        })
    })
  })
}
// Hết Đổi trạng thái 



//Đổi trạng thái cho nhiều bản ghi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (event) => {
        event.preventDefault();

        const status = formChangeMulti.status.value;
        if(status == "delete") {
          const isConfirm = confirm("Bạn có chắc chắn muốn xoá những bản ghi này");
          if(!isConfirm) {
            return; // khong chạy những câu lệnh ở dưới
          }
        }
        const ids = [];
        const listInputChangeChecked = document.querySelectorAll("[input-change]:checked");
        const path = formChangeMulti.getAttribute("data-path");
        
        listInputChangeChecked.forEach(input => {
            const id = input.getAttribute("input-change");
            ids.push(id);
        })

        const data = {
            ids: ids,
            status: status
        };

        fetch(path, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if(data.code == "success") {
                    location.reload();
                }
            })      
    })
}
// Hết Đổi trạng thái cho nhiều bản ghi


// Xoá bản ghi
const listButtonDelete = document.querySelectorAll("[button-delete]");
if(listButtonDelete.length > 0) {
  listButtonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này?");

      if(isConfirm) {
        const id = button.getAttribute("item-id");
        const path = button.getAttribute("data-path");

        fetch(path, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify({
            id: id
          })
        })
          .then(res => res.json())
          .then(data => {
            if(data.code == "success") {
              location.reload();
            }
          })
      }
    })
  })
}
// Hết xoá bản ghi


// Đổi vị trí
const listInputPosition = document.querySelectorAll("[input-position]");
if(listInputPosition.length > 0) {
  listInputPosition.forEach(input => {
    input.addEventListener("change", () => {
      const position = parseInt(input.value);
      const id = input.getAttribute("item-id");
      const path = input.getAttribute("data-path");

      fetch(path, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          id: id,
          position: position
        })
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "success") {
            location.reload();
          }
        })
    })
  })
}
// Hết đổi vị trí


// alert message
const alertMessage = document.querySelector("[alert-message]");
if(alertMessage) {
  setTimeout(() => {
    alertMessage.style.display = "none";
  }, 3000);
}
// End alert message


// Image Preview
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  })
}

// End image preview


// Sắp xếp
const sortSelect = document.querySelector("[sort-select]");
if(sortSelect) {
  let url = new URL(location.href); // Nhân bản url
  // Bắt sự kiện onChange
  sortSelect.addEventListener("change", () => {
    const value = sortSelect.value;
    
    if(value) {
      const [sortKey, sortValue] = value.split("-");
      console.log(sortKey);
      console.log(sortValue);
      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);
    } else {
      url.searchParams.delete("sortKey");
      url.searchParams.delete("sortValue");
    }
    location.href = url.href;
  })
  // Hiển thị lựa chọn mặc định
  const sortKeyCurrent = url.searchParams.get("sortKey");
  const sortValueCurrent = url.searchParams.get("sortValue");
  if(sortKeyCurrent && sortValueCurrent) {
    sortSelect.value = `${sortKeyCurrent}-${sortValueCurrent}`;
  }
}
// Hết sắp xếp