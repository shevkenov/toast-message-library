import Toast from "./Toast.js";


document.querySelector('button').addEventListener('click', () => {
    const toast = new Toast({
        position: Math.random() > .5 ? 'top-right' : 'top-center', 
        text: 'new toast message',
        //showProgress: false,
        //autoClose: false,
        //canClose: false,
        // onClose: () => alert('hi')
    });
})



// setTimeout(() => {
//     toast.update({position: 'top-left', text: 'some new value'})
// }, 1000)