function InputBox({ placeholde, label, onChange , name}) {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2">

      {label}
      </div>
     
      <input
      onChange={onChange}
      name={name}
        type="text"
        placeholder={placeholde}
        className="w-full px-2 py-1 border rounded border-slate-200"
      />
    </div>
  );
}

export default InputBox;
