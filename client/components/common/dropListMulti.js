'use client';

import Select from 'react-select';

const DropListMulti = (props) => {
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            boxShadow: 'none',
            borderColor: state.isFocused ? 'var(--primary-color)' : '',
            borderColor: props.isErr ? 'red' : '',
            '&:hover': { borderColor: state.isFocused ? 'var(--primary-color)' : '' },
            borderWidth: state.isFocused ? '2px' : '1px',
            borderRadius: '0.5rem',
        }),
        valueContainer: (base) => ({
            ...base,
            backgroundPosition: 'calc(100% - 12px) center !important',
            background: `url("data:image/svg+xml, <svg width='20' height='20' viewBox='0 0 20 20' aria-hidden='true' class='svg' xmlns='http://www.w3.org/2000/svg'><path d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z'></path></svg>") no-repeat`,
            // background: 'red'
        }),
        indicatorsContainer: (base) => ({
            ...base,
            display: 'none !important',
        }),
        indicatorSeparator: (base) => ({
            ...base,
            display: 'none !important',
        }),
        placeholder: (base) => ({
            ...base,
            paddingLeft: '4px',
            fontSize: '1.5rem',
            lineHeight: 0,
            color: '#000000',
            // color: 'red',
        }),
        singleValue: (base) => ({
            ...base,
            paddingLeft: '2px',
            fontSize: '1.5rem',
            // color: 'red',
        }),
        menuList: (base) => ({
            ...base,
            // borderRadius: '10px !important',
            borderRadius: 'unset !important',
            // borderColor: 'blue',
            padding: '0 !important',
        }),
        menu: (base) => ({
            ...base,
            marginTop: '2px !important',
            // borderWidth: '10px !important',
            // borderRadius: '10px !important',
            borderRadius: 'unset !important',
            // borderColor: 'blue',
            padding: '0 !important',
        }),
        option: (base, { isSelected }) => ({
            ...base,
            backgroundColor: isSelected ? '#2684ff' : '#ffffff',
            ':hover': {
                backgroundColor: '#2684ff',
                color: '#ffffff',
            },
            padding: '0 16px',
            fontSize: '1.5rem',
            color: isSelected ? '#ffffff' : '#000000',
        }),
        noOptionsMessage: (base) => ({
            ...base,
            padding: '0 16px',
            fontSize: '1.5rem',
        }),
    };

    return (
        <>
            <Select
                placeholder={props.placeholder}
                value={props.value}
                options={props.options}
                onChange={props.onChange}
                onBlur={props.onBlur}
                isMulti
                styles={selectStyles}
            />
            <p className="text-[1.3rem] text-red-600">{props.msg}</p>
        </>
    );
};

export default DropListMulti;
