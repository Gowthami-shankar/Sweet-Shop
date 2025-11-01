import React from 'react';
import SweetCard from './SweetCard';

function SweetList({ 
  sweets, 
  onAction, 
  actionType, 
  onEdit, 
  onDelete 
}) {
  if (!sweets || sweets.length === 0) {
    return <p>No sweets found.</p>;
  }

  return (
    <div className="sweet-list">
      {sweets.map(sweet => (
        <SweetCard
          key={sweet._id}
          sweet={sweet}
          onAction={onAction}
          actionType={actionType}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default SweetList;
