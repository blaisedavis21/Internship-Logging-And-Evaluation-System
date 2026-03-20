import React, { useState } from 'react';

const AccordionContext = React.createContext();

export const Accordion = ({ children, className }) => {
  const [openItem, setOpenItem] = useState(null);
  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ children, value, className }) => {
  const { openItem } = React.useContext(AccordionContext);
  const isOpen = openItem === value;
  return (
    <div className={className} data-state={isOpen ? 'open' : 'closed'} data-value={value}>
      {React.Children.map(children, child => React.cloneElement(child, { itemValue: value }))}
    </div>
  );
};

export const AccordionTrigger = ({ children, className, itemValue }) => {
  const { openItem, setOpenItem } = React.useContext(AccordionContext);
  const isOpen = openItem === itemValue;
  return (
    <div 
      className={`cursor-pointer flex justify-between items-center w-full ${className}`} 
      onClick={() => setOpenItem(isOpen ? null : itemValue)}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {children}
    </div>
  );
};

export const AccordionContent = ({ children, className, itemValue }) => {
  const { openItem } = React.useContext(AccordionContext);
  if (openItem !== itemValue) return null;
  return <div className={className}>{children}</div>;
};
