import React from "react";

const FindComment = ({ LastComments, isCommentLoading }) => {
  console.log(LastComments);
  return (
    <div>
      {LastComments.map((ren) => {
        return (
          <div>
            <h3>{ren.fullName}</h3>
            <p>{ren.text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default FindComment;
