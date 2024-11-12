import React, { useEffect, useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import { SideBlock } from "./SideBlock";
import { Link } from "react-router-dom";

export const TagsBlock = ({ items, isLoading = true }) => {
  if (items.length > 0) {
    isLoading = false;
  }
  return (
    <SideBlock title="Тэги">
      <List>
        {items.length > 0 ? (
          items.map((name, i) => (
            <Link
              key={i}
              style={{ textDecoration: "none", color: "black" }}
              to={`/tags/${name.tags}`}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <TagIcon />
                  </ListItemIcon>
                  {isLoading ? (
                    <Skeleton width="100%" height={40} />
                  ) : (
                    <ListItemText primary={name.tags} />
                  )}
                </ListItemButton>
              </ListItem>
            </Link>
          ))
        ) : (
          <p>No tags available</p>
        )}
      </List>
    </SideBlock>
  );
};
