import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";

export const ForTagsComponent = ({ items, children, isLoading = true }) => {
  return (
    <List>
      {isLoading
        ? [...Array(5)]
        : items.map((obj, index) => {
            return (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    {isLoading ? (
                      <Skeleton variant="circular" width={40} height={40} />
                    ) : (
                      <Avatar
                        alt={obj.avatarUrl}
                        src={`${process.env.REACT_APP_URL}/${obj.avatarUrl}`}
                      />
                    )}
                    {isLoading ? (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Skeleton variant="text" height={25} width={120} />
                        <Skeleton variant="text" height={18} width={230} />
                      </div>
                    ) : (
                      <ListItemText
                        primary={obj?.fullName}
                        secondary={obj.text}
                      />
                    )}
                  </ListItemAvatar>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            );
          })}
    </List>
  );
};
