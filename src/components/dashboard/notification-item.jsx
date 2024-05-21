import React from 'react';
import PropsType from 'prop-types';

export default function NotificationItem(props) {
    let {status, title, message} = props;
  return (
    <div className='flex items-center gap-2 cursor-pointer hover:bg-primary/20 w-full rounded-md p-2'>
        <span className={`w-3 h-2 rounded-full flex ${status ? 'bg-primary opacity-100' : 'opacity-0'}`}></span>
        <div className='space-y-1'>
            <h1 className={`text-sm font-bold ${status ? "text-primary": "text-foreground"}`}>{title}</h1>
            <p className='text-xs'>{message}</p>
        </div>
    </div>
  )
}

NotificationItem.propTypes = {
    status: PropsType.bool,
    title: PropsType.string,
    message: PropsType.string
}
