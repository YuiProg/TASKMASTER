import React from 'react'
import './TrTable.scss'
import {
  Trash2,
  SquarePen,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Archive,
  SlidersHorizontal
} from 'lucide-react'
import PropTypes from 'prop-types'
import Button from '../TRButton/Button'

export class Table extends React.Component {
  constructor(props) {
    super(props)
    this.tableContainerRef = React.createRef()

    this.state = {
      selectAll: false,
      selected: this.props.data ? new Array(props.data.length).fill(false) : [],
      productSelect: null,
      currentPage: 1,
      sortKey: null,
      sortDir: null
    }
  }

  componentDidMount() {
    if (this.tableContainerRef.current) {
      this.tableContainerRef.current.addEventListener('wheel', this.handleHorizontalScroll, {
        passive: false
      })
    }
  }

  componentWillUnmount() {
    if (this.tableContainerRef.current) {
      this.tableContainerRef.current.removeEventListener('wheel', this.handleHorizontalScroll)
    }
  }

  handleHorizontalScroll = (e) => {
    const container = this.tableContainerRef.current
    if (!container) return

    const isHorizontallyScrollable = container.scrollWidth > container.clientWidth

    if (isHorizontallyScrollable) {
      e.preventDefault()
      container.scrollLeft += e.deltaY
    }
  }

  get rowsPerPage() {
    return this.props.limit || 10
  }

  componentDidUpdate(prevProps) {
    if (prevProps.search !== this.props.search) {
      this.setState({ currentPage: 1 })
    }

    if (prevProps.data !== this.props.data) {
      this.setState({
        selected: new Array(this.props.data.length).fill(false),
        selectAll: false
      })
    }
  }

  selectAll = () => {
    this.setState((prev) => {
      const selectAll = !prev.selectAll
      const selected = [...prev.selected]

      const startIndex = (prev.currentPage - 1) * this.rowsPerPage
      const endIndex = startIndex + this.rowsPerPage
      for (let i = startIndex; i < endIndex && i < this.props.data.length; i++) {
        selected[i] = selectAll
      }

      if (this.props.selectedItems) {
        const selectedRows = this.props.data.filter((_, i) => selected[i])
        this.props.selectedItems(selectedRows)
      }

      return { selectAll, selected }
    })
  }

  toggleRow = (index) => {
    this.setState((prev) => {
      const selected = [...prev.selected]
      selected[index] = !selected[index]

      if (this.props.selectedItems) {
        const selectedRows = this.props.data.filter((_, i) => selected[i])
        this.props.selectedItems(selectedRows)
      }

      return {
        selected,
        selectAll: selected.every(Boolean)
      }
    })
  }

  goToPage = (page) => {
    const totalPages = Math.ceil(this.props.data.length / this.rowsPerPage)
    if (page < 1 || page > totalPages) return
    this.setState({ currentPage: page })
  }

  filterByValue(array, string) {
    return array.filter((o) =>
      Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(string.toLowerCase()))
    )
  }

  handleSort = (key) => {
    this.setState((prev) => {
      if (prev.sortKey !== key) return { sortKey: key, sortDir: 'asc', currentPage: 1 }
      if (prev.sortDir === 'asc') return { sortKey: key, sortDir: 'desc', currentPage: 1 }
      return { sortKey: null, sortDir: null, currentPage: 1 }
    })
  }

  sortData = (array) => {
    const { sortKey, sortDir } = this.state
    if (!sortKey || !sortDir) return array

    return [...array].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (!isNaN(aVal) && !isNaN(bVal)) {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      if (aStr < bStr) return sortDir === 'asc' ? -1 : 1
      if (aStr > bStr) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }

  handleFilterToggle = () => {
    this.filtersOpen = !this.filtersOpen
    if (this.props.onFilterToggle) {
      this.props.onFilterToggle(this.filtersOpen)
    }
  }

  render() {
    const {
      data,
      hasSelect,
      hasAction,
      onDelete,
      onEdit,
      isDetailed,
      search,
      onView,
      isLoading,
      onRowSelect,
      noDataMessage,
      noEdit,
      hasTableFilters
    } = this.props
    const { selectAll, selected, currentPage, sortKey, sortDir } = this.state

    const filteredData = search ? this.filterByValue(data, search) : data
    const sortedData = this.sortData(filteredData)

    const totalPages = sortedData ? Math.ceil(sortedData.length / this.rowsPerPage) : null
    const startIndex = (currentPage - 1) * this.rowsPerPage
    const paginatedData = sortedData
      ? sortedData.slice(startIndex, startIndex + this.rowsPerPage)
      : null
    const paginatedSelected = paginatedData
      ? selected.slice(startIndex, startIndex + this.rowsPerPage)
      : null

    const selectedRows = this.props.data.filter((_, i) => selected[i])

    const headers =
      this.props.data && this.props.data.length > 0 ? Object.keys(this.props.data[0]) : []

    const hasData = paginatedData && paginatedData.length > 0
    const shouldPaginate = sortedData && sortedData.length > this.rowsPerPage

    let pageNumbers = []
    for (var i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }

    const colCount = (headers ? headers.length : 0) + (hasSelect ? 1 : 0) + (hasAction ? 1 : 0)

    return (
      <div className="tr-table">
        {isDetailed && data ? (
          <div className="tr-table__header">
            <div className="tr-table__title-area">
              <span className="tr-table__eyebrow">Management Console</span>
              <h1 className="tr-table__title">{isDetailed.header}</h1>
            </div>
            <div className="tr-table__header-actions">
              <div className="tr-table__search">{isDetailed.search}</div>
              {isDetailed.hasButton && isDetailed.hasDelete ? (
                <>
                  <Button error text={isDetailed.buttonInfo} onClick={(e) => isDetailed.CB(e)} />
                  <Button
                    cancel
                    text={isDetailed.deleteBtnInfo}
                    onClick={() => isDetailed.CBD(selectedRows)}
                  />
                </>
              ) : (
                isDetailed.hasButton && (
                  <Button error text={isDetailed.buttonInfo} onClick={(e) => isDetailed.CB(e)} />
                )
              )}
              {hasTableFilters && (
                <Button
                  cancel
                  text={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <SlidersHorizontal size={15} />
                    </span>
                  }
                  onClick={this.handleFilterToggle}
                />
              )}
            </div>
          </div>
        ) : (
          hasTableFilters && (
            <div className="tr-table__header tr-table__header--isolated">
              <div className="tr-table__header-actions" style={{ marginLeft: 'auto' }}>
                <Button
                  cancel
                  text={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <SlidersHorizontal size={15} />
                      Filters
                    </span>
                  }
                  onClick={this.handleFilterToggle}
                />
              </div>
            </div>
          )
        )}

        <div className="tr-table__scroll" ref={this.tableContainerRef}>
          <table className="tr-table__table">
            <thead className="tr-table__thead">
              <tr className="tr-table__head-row">
                {hasSelect && data && data.length > 0 ? (
                  <th className="tr-table__th tr-table__th--check">
                    <input
                      className="tr-table__checkbox"
                      type="checkbox"
                      checked={selectAll}
                      onChange={this.selectAll}
                    />
                  </th>
                ) : null}
                {headers.map((h, i) => (
                  <th
                    className="tr-table__th tr-table__th--sortable"
                    key={i}
                    onClick={() => this.handleSort(h)}
                  >
                    <span className="tr-table__th-content">
                      {h.toUpperCase()}
                      <span className="tr-table__sort-icon">
                        {sortKey === h ? (
                          sortDir === 'asc' ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : (
                          <ChevronDown size={14} className="tr-table__sort-icon--inactive" />
                        )}
                      </span>
                    </span>
                  </th>
                ))}
                {hasAction && data && data.length > 0 ? (
                  <th className="tr-table__th tr-table__th--action">ACTIONS</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="tr-table__tbody">
              {isLoading ? (
                <TableLoading colCount={colCount} />
              ) : hasData ? (
                <TableData
                  data={paginatedData}
                  hasSelect={hasSelect}
                  selected={paginatedSelected}
                  toggleRow={(i) => this.toggleRow(startIndex + i)}
                  hasAction={hasAction}
                  CBD={(e) => onDelete(e)}
                  CBE={(e) => onEdit(e)}
                  onView={(e) => onView(e)}
                  rowCB={(e) => onRowSelect(e)}
                  noEdit={noEdit}
                />
              ) : (
                <TableNoData colSpan={colCount} message={noDataMessage} />
              )}
            </tbody>
          </table>
        </div>

        {shouldPaginate && (
          <div className="tr-table__pagination">
            <span className="tr-table__pagination-info">
              {sortedData
                ? `Showing ${Math.min(startIndex + this.rowsPerPage, sortedData.length)} of ${sortedData.length} results`
                : null}
            </span>
            <div className="tr-table__pagination-controls">
              <button
                type="button"
                className="tr-table__pagination-btn"
                onClick={() => this.goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={15} />
              </button>
              {pageNumbers.map((page) => {
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  page === currentPage ||
                  page === currentPage - 1 ||
                  page === currentPage + 1

                const showLeftDots = page === currentPage - 1 && currentPage - 1 > 2
                const showRightDots = page === currentPage + 1 && currentPage + 1 < totalPages - 1

                if (showLeftDots) {
                  return (
                    <React.Fragment key={page}>
                      <span className="tr-table__pagination-dots">...</span>
                      <button
                        type="button"
                        className={
                          currentPage === page
                            ? 'tr-table__pagination-page tr-table__pagination-page--active'
                            : 'tr-table__pagination-page'
                        }
                        onClick={() => this.goToPage(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  )
                }

                if (showRightDots) {
                  return (
                    <React.Fragment key={page}>
                      <button
                        type="button"
                        className={
                          currentPage === page
                            ? 'tr-table__pagination-page tr-table__pagination-page--active'
                            : 'tr-table__pagination-page'
                        }
                        onClick={() => this.goToPage(page)}
                      >
                        {page}
                      </button>
                      <span className="tr-table__pagination-dots">...</span>
                    </React.Fragment>
                  )
                }

                if (showPage) {
                  return (
                    <button
                      type="button"
                      key={page}
                      className={
                        currentPage === page
                          ? 'tr-table__pagination-page tr-table__pagination-page--active'
                          : 'tr-table__pagination-page'
                      }
                      onClick={() => this.goToPage(page)}
                    >
                      {page}
                    </button>
                  )
                }
                return null
              })}

              <button
                type="button"
                className="tr-table__pagination-btn"
                onClick={() => this.goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export class TableLoading extends React.Component {
  render() {
    const { colCount } = this.props
    return (
      <tr>
        <td colSpan={colCount} className="tr-table__td--nodata">
          <div className="tr-table__empty">
            <div className="tr-table__spinner" />
          </div>
        </td>
      </tr>
    )
  }
}

export class TableData extends React.Component {
  formatValue = (key, value) => {
    const phpKeys = ['salary', 'price', 'paid', 'total', 'amountPaid', 'subtotal', 'change']
    if (phpKeys.includes(key)) {
      return `PHP ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    if (value === 'ACTIVE') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#22C55E', fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
          ACTIVE
        </span>
      )
    }
    if (value === 'INACTIVE') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6B7280', fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6B7280', display: 'inline-block' }} />
          INACTIVE
        </span>
      )
    }
    if (value === 'PENDING') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#F97316', fontWeight: 500 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316', display: 'inline-block' }} />
          PENDING
        </span>
      )
    }
    return value
  }

  render() {
    const { data, hasSelect, selected, toggleRow, hasAction, CBD, CBE, onView, rowCB, noEdit } = this.props

    return (
      <>
        {data.map((row, rowIndex) => {
          return (
            <tr
              className={selected[rowIndex] === true ? 'tr-table__row tr-table__row--selected' : 'tr-table__row'}
              key={rowIndex}
              onClick={() => rowCB(row)}
            >
              {hasSelect ? (
                <td className="tr-table__td tr-table__td--check" onClick={(e) => e.stopPropagation()}>
                  <input
                    className="tr-table__checkbox"
                    type="checkbox"
                    checked={selected[rowIndex] ?? false}
                    onChange={() => toggleRow(rowIndex)}
                  />
                </td>
              ) : null}
              {Object.entries(row).map(([key, value], colIndex) => (
                <td className="tr-table__td" key={colIndex}>
                  {colIndex === 0 ? (
                    <strong
                      className="tr-table__id-link"
                      onClick={(e) => {
                        e.stopPropagation()
                        onView(row)
                      }}
                    >
                      {value}
                    </strong>
                  ) : (
                    this.formatValue(key, value)
                  )}
                </td>
              ))}
              {hasAction ? (
                <td className="tr-table__td tr-table__td--action">
                  {!noEdit && (
                    <button
                      type="button"
                      className="tr-table__action-btn tr-table__action-btn--edit"
                      onClick={(e) => {
                        e.stopPropagation()
                        CBE(row)
                      }}
                    >
                      <SquarePen size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="tr-table__action-btn tr-table__action-btn--delete"
                    onClick={(e) => {
                      e.stopPropagation()
                      CBD(row)
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              ) : null}
            </tr>
          )
        })}
      </>
    )
  }
}

export class TableNoData extends React.Component {
  render() {
    const { message } = this.props
    return (
      <tr>
        <td colSpan={this.props.colSpan} className="tr-table__td--nodata">
          <div className="tr-table__empty">
            <Archive size={28} strokeWidth={1.5} className="tr-table__empty-icon" />
            <p className="tr-table__empty-title">{message ? message : `No data found :(`}</p>
          </div>
        </td>
      </tr>
    )
  }
}

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasSelect: PropTypes.bool,
  hasAction: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  search: PropTypes.string,
  isLoading: PropTypes.bool,
  noEdit: PropTypes.bool,
  hasTableFilters: PropTypes.bool,
  onFilterToggle: PropTypes.func,
  selectedItems: PropTypes.func,
  isDetailed: PropTypes.shape({
    header: PropTypes.string,
    search: PropTypes.node,
    hasButton: PropTypes.bool,
    buttonInfo: PropTypes.string,
    CB: PropTypes.func
  })
}

TableData.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasSelect: PropTypes.bool,
  hasAction: PropTypes.bool,
  selected: PropTypes.arrayOf(PropTypes.bool),
  toggleRow: PropTypes.func,
  CBD: PropTypes.func,
  CBE: PropTypes.func,
  noEdit: PropTypes.bool
}

TableLoading.propTypes = {
  colCount: PropTypes.number.isRequired
}

TableNoData.propTypes = {
  colSpan: PropTypes.number
}
