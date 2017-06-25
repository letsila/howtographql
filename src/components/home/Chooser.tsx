import * as React from 'react'
import Link from 'gatsby-link'
import * as classNames from 'classnames'
import withWidth from './withWidth'
import DottedListItem from './DottedListItem'
import LeftColumn from './LeftColumn'
import data from './List'
import * as groupBy from 'lodash/groupBy'
import * as sortBy from 'lodash/sortBy'

import '../../styles/reset.css'
import '../../styles/main.css'
import { MarkdownRemark } from '../../types'

interface Props {
  width?: number
  mds: MarkdownRemark[]
}

interface State {
  selectedIndex: number
}

class Chooser extends React.Component<Props, State> {
  state = {
    selectedIndex: 0,
  }

  selectStack = index => {
    this.setState({ selectedIndex: index })
  }

  extractGroup(slug) {
    return slug.split('/')[3]
  }

  render() {
    const { width, mds } = this.props
    const { selectedIndex } = this.state
    const widthElement = 140 + 20
    const widthElementSelected = 140 + 80
    const translateX =
      (width || 1) / 2 - widthElement * selectedIndex - widthElementSelected / 2

    const groupedChapters = groupBy(mds, md =>
      this.extractGroup(md.fields.slug),
    )

    const tutorials = data.map(tutorial => {
      let steps = tutorial.steps
      if (groupedChapters[tutorial.key]) {
        steps = groupedChapters[tutorial.key].map(chapter => ({
          link: chapter.fields.slug,
          title: chapter.frontmatter.title,
        }))
        // when step.link is  "/tutorials/frontend/react-apollo/7-filtering-searching-the-list-of-links/"
        // sort by 7
        steps = sortBy(steps, step =>
          parseInt(step.link.split('/')[4].split('-')[0], 10),
        )
      }
      return {
        ...tutorial,
        steps,
      }
    })
    const selected = tutorials[selectedIndex]

    return (
      <div className="steps-container">
        <style jsx={true}>{`
          div.steps-container {
            @p: .white, .bgDarkBlue;
          }
          img {
            @p: .mh6;
            height: 40px;
            width: auto;
          }
          .stacks-content {
            @p: .overflowHidden, .flex;
            height: 180px;
            align-items: center;
          }
          .stacks {
            @p: .flex;
            transition: transform 0.2s ease-out;
            align-items: center;
          }
          .stacks-item {
            @p: .tc, .pointer, .mv0, .mh10;
            transition: all 0.1s ease-out;
            user-select: none;
            width: 140px;
          }
          .stacks-item img {
            @p: .o30;
            filter: grayscale(100%);
          }
          .stacks-item p {
            @p: .mt10, .o40, .f14;
          }
          .stacks-item.active {
            @p: .ba, .bWhite20, .bw2, .pv16, .mv0, .mh38;
            transform: scale(1.2);
            border-radius: 6px;
          }
          .stacks-item.active img {
            @p: .o100;
            filter: grayscale(0%);
          }
          .stacks-item.active p {
            @p: .o100;
          }
          .steps-content {
            @p: .flex;
          }
          .steps-content :global(.steps-description) {
            margin-top: 48px;
          }
          .steps-list {
            @p: .w50;
          }
          .steps-list.fade-before::before {
            @p: .db;
            content: '';
            height: 48px;
            background-image: linear-gradient(
              to top,
              rgba(225, 225, 225, 0.2),
              #172a3a
            );
            width: 2px;
          }
          .steps-list::after {
            content: '';
            display: block;
            height: 48px;
            background-image: linear-gradient(
              to bottom,
              rgba(225, 225, 225, 0.2),
              #172a3a
            );
            width: 2px;
          }
          p {
            @p: .white;
          }
        `}</style>
        <div className="steps-content">
          <LeftColumn>
            <h3>Practical part</h3>
          </LeftColumn>
          <div className="steps-list">
            <DottedListItem>
              <Link to={''}>
                Which tutorial should I pick next?
              </Link>
            </DottedListItem>
          </div>
        </div>
        <div className="stacks-content">
          <div
            className="stacks"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {tutorials.map((tutorial, index) =>
              <div
                className={classNames('stacks-item', {
                  active: selectedIndex === index,
                })}
                onClick={this.selectStack.bind(this, index)}
                key={index}
              >
                <div>
                  <img src={tutorial.images[0]} />
                  {tutorial.images[1] && <img src={tutorial.images[1]} />}
                  <p>{tutorial.title}</p>
                </div>
              </div>,
            )}
          </div>
        </div>
        <div className="steps-content">
          <LeftColumn className="steps-description">
            <h3>{selected.content.title}</h3>
            <p>{selected.content.description}</p>
          </LeftColumn>
          <div className="steps-list fade-before">
            {selected.steps.map((step, index) =>
              <DottedListItem key={index}>
                <Link to={step.link}>
                  {step.title}
                </Link>
              </DottedListItem>,
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default withWidth<Props>()(Chooser)