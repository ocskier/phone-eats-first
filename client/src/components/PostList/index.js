import React, { useState, useRef, useEffect, useMemo } from "react";
import Ratings from "../ReadOnlyRatings";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";

import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import CommentIcon from "@material-ui/icons/Comment";

import API from "../../utils/API";
import FBShareButton from "../FBShareButton";

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 345,
    margin: "0 25%",
    marginBottom: "20px",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  avatar: {
    backgroundColor: red[(500, 400, 300)],
  },
  caption: {
    paddingTop: "10px",
    paddingBottom: "0px",
  },
  comments: {
    paddingTop: "0px",
    paddingBottom: "10px",
  },
  addComment: {
    padding: "1px",
    width: "88%",
  },
  sendButton: {
    width: "10%",
    margin: "6px",
    float: "right",
  },
  actionButtons: {
    paddingTop: "0px",
    paddingBottom: "0px",
  },
}));

// PostList renders a
export function PostList({ children }) {
  return <div className="postCard"> {children} </div>;
}

// PostListItem renders a item containing data from the posts api call
export function PostListItem({
  id,
  username,
  image,
  restaurant_name,
  rating,
  caption,
  number_of_likes,
  comments,
}) {
  const classes = useStyles();
  const commentInput = useRef(null);

  const [likes, setLikes] = useState(number_of_likes);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([...comments]);

  const toRenderComments = useMemo(() => {
    return allComments.map((comment) => {
      return (
        <Typography
          className={classes.comments}
          variant="body2"
          color="textSecondary"
          component="p"
        >
          {comment.comment}
        </Typography>
      );
    });
  }, [allComments]);

  // Loads all posts and sets them to pots
  function getCommentsOfPost() {
    API.getAllComments(id)
      .then((res) => {
        console.log("comments", res.data.comments);
        setAllComments([
          ...allComments,
          res.data.comments[res.data.comments.length - 1],
        ]);
      })
      .catch((err) => console.log(err));
  }

  const handleCommentClick = (e) => {
    e.preventDefault();
    commentInput.current.focus();
  };

  const handleLikeClick = (e) => {
    e.preventDefault();
    API.updateLike(id)
      .then((res) => {
        console.log("liked");
        setLikes(likes + 1);
      })
      .catch((err) => console.log(err));
  };

  const handleAddCommentButtonClick = (e) => {
    e.preventDefault();
    if (comment.length > 0) {
      API.createComment({
        id: id,
        comment: comment,
        username: username,
      })
        .then((res) => {
          console.log("load all comments", comments);

          setComment("");
          getCommentsOfPost();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {username[0]}
          </Avatar>
        }
        action={<Ratings ratingValue={rating} />}
        title={username}
        subheader={restaurant_name}
      />
      <CardMedia className={classes.media} image={image} title={caption} />
      <CardContent className={classes.caption}>
        <Typography variant="body3" color="textSecondary" component="h6">
          {caption}
        </Typography>
      </CardContent>

      <CardActions className={classes.actionButtons} disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon onClick={handleLikeClick} />
        </IconButton>

        <Typography variant="body3" color="textSecondary" component="h6">
          {likes} likes
        </Typography>

        <IconButton aria-label="comment">
          <CommentIcon onClick={handleCommentClick} />
        </IconButton>

        {/* <IconButton aria-label="share"> */}
        {/* <ShareIcon /> */}
        <FBShareButton />
        {/* </IconButton> */}
      </CardActions>

      <CardContent className={classes.comments}>
        {toRenderComments}
        {/* <form noValidate> */}
        <TextField
          className={classes.addComment}
          id="filled-textarea"
          placeholder="Add Comment"
          multiline
          variant="outlined"
          inputRef={commentInput}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          variant="outlined"
          size="large"
          color="primary"
          className={classes.sendButton}
          onClick={handleAddCommentButtonClick}
        >
          Send
        </Button>
        {/* </form> */}
      </CardContent>
    </Card>
  );
}
