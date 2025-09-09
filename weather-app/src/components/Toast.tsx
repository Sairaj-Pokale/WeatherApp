import { useState, FC } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


interface ToastProps {
    color: string;
    desc: string;
}

const Toast: FC<ToastProps> = ({ color, desc }) => {
    const [visible, setVisible] = useState(true)

    // if you want to make the toast disappear in 20 secs then uncomment the following code I don't think you need it
    // useEffect(() => {
    //   const timer = setTimeout(() => {
    //     setVisible(false);
    //   }, 20000);

    //   return () => clearTimeout(timer);
    // }, []);

    console.log(visible)

    return (
        <>
            {/* <div className='border-danger bg-danger-subtle text-danger'>HELLO WOrld</div> */}
            {visible ? <div className={`border border-2 w-100 mt-2 px-4 py-2 rounded ${color == "yellow" ? "border-warning bg-warning-subtle" : "border-danger bg-danger-subtle"}`}>
                <div className={`${color == "yellow" ? "text-warning-subtle" : "text-danger-subtle"}`}>{desc}</div>
            </div> : null}
        </>
    )
}

export default Toast;