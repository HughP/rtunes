package com.extjs.common.utils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

/**
 * <p>List implementation for Records.</p>
 *
 * <p>Copyright © BuildOnline 2004. All rights reserved.</p>
 */

public class RecordList <E extends Record> implements List <E> {
	private static final int NOT_AVAILABLE = -1;

    private List<E> records;

    private int firstRecordNumber = NOT_AVAILABLE;

    private int totalRecordCount;

    private int maxPageSize;
    
    public RecordList()
    {
        records = new ArrayList<E>();
    }
    
    public RecordList(int maxPageSize)
    {
    	this.maxPageSize = maxPageSize;
        records = new ArrayList<E>();
    }
    
    /**
     * To be able to use ui table tag on jsp to render list of objects, it must be RecordList.
     * The Hibernate DAO returns Collection object rather that RecordList as in the case of 
     * Oracle DAO. So this is the place to convert your Collection to to RecordList.
     */
    public RecordList(List<E> records, Integer fromRow, Integer maxRows, Integer totalRecords){
    	
    	int toIndex = fromRow + maxRows;
    	
    	// sublist toIndex shoutn't be greater then total records in the list.
    	if (toIndex > totalRecords) {
    		toIndex = totalRecords;
		}
    	this.records = records.subList(fromRow, toIndex);
    	this.maxPageSize = maxRows.intValue() ;
    	setFirstRecordNumber(fromRow + 1);
    	setTotalRecordCount(totalRecords);
    }
    
    // RecordList specific methods

    /**
     * Appends the specified record at the end of this record list
     */
    
    /**
	 * @return Returns the list of records.
	 */
	public List<E> getRecords() 
	{
		return records;
	}

    
    public boolean addRecord(E record)
    {
        boolean ret = records.add(record);

        if (firstRecordNumber == NOT_AVAILABLE) {
            firstRecordNumber = 1;
        }

        return ret;
    }

    /**
     * Set the record number for the first record in the list. The default first record number is 1.
     */
    public void setFirstRecordNumber(int first)
    {
        if (first <= 0) {
            throw new IllegalArgumentException("First record number cannot be less than or equal to zero");
        }

        this.firstRecordNumber = first;
    }

    /**
     * Set the total record count for records that may or may not have been added to this record list.
     */
    public void setTotalRecordCount(int count)
    {
        int minRecordCount = minimumTotalRecordCount();

        if (count < minRecordCount) {
            throw new IllegalArgumentException(
                "Total record count " + count + " is less than minimum record count " + minRecordCount);
        }

        totalRecordCount = count;
    }

    /**
     * Retreive the record number of the first record in this record list
     */
    public int getFirstRecordNumber()
    {
        return firstRecordNumber;
    }

    /**
     * Retreive the record number of the last record in this record list
     */
    public int getLastRecordNumber()
    {
        if (firstRecordNumber == NOT_AVAILABLE) {
            return NOT_AVAILABLE;
        }
        else {
            return minimumTotalRecordCount();
        }
    }

    /**
     * Retrieve the total record count, for all records that may or may not be contained in this record list.
     */
    public int getTotalRecordCount()
    {
        int minRecordCount = minimumTotalRecordCount();

        if (totalRecordCount > minRecordCount) {
            return totalRecordCount;
        }
        else {
            return minRecordCount;
        }
    }

    /**
     * Derive a minimum total record count from the firstRecordNumber and the number of records in this list
     *
     * @return
     */
    private int minimumTotalRecordCount()
    {
        return (firstRecordNumber - 1) + size();
    }
    
	/**
	 * Indicates the total number of records
	 **/
	
	public int getTotalRowCount()
	{
		return totalRecordCount;
	}

    // List method implemenations

    /**
     * Return the number of records in the list
     */
    public int size()
    {
        return records.size();
    }

    /**
     * Return true if the list contains no elements
     */
    public boolean isEmpty()
    {
        return records.isEmpty();
    }

    /**
     * Returns true if this list contains the specified element. More formally, returns true if and only if
     * this list contains at least one element e such that (o==null ? e==null : o.equals(e)).
     */
    public boolean contains(Object o)
    {
        return records.contains(o);
    }

    /**
     * Returns an iterator over the elements in this list in proper sequence.
     */
    public Iterator<E> iterator()
    {
        return Collections.unmodifiableList(records).iterator();
    }

    /**
     * Returns an array containing all of the elements in this list in proper sequence. Obeys the general
     * contract of the Collection.toArray method.
     */
    public Object[] toArray()
    {
        return records.toArray();
    }

    /**
     * Returns an array containing all of the elements in this list in proper sequence; the runtime type of
     * the returned array is that of the specified array. Obeys the general contract of the
     * Collection.toArray(Object[]) method.
     */
    public <T> T[] toArray(T[] a)
    {
        return records.toArray(a);
    }

    /**
     * Unsupported operation.
     */
    public boolean add(E o)
    {
        throw new UnsupportedOperationException("Adding objects to a RecordList is not supported.");
    }

    /**
     * Unsupported operation.
     */
    public boolean remove(Object o)
    {
        throw new UnsupportedOperationException("Removing objects from a RecordList is not supported.");
    }

    /**
     * Returns true if this list contains all of the elements of the specified collection.
     */
    public boolean containsAll(Collection c)
    {
        return records.containsAll(c);
    }

    /**
     * Unsupported operation
     */
    public boolean addAll(Collection c)
    {
        throw new UnsupportedOperationException("Adding objects to a RecordList is not supported.");
    }

    /**
     * Unsupported operation
     */
    public boolean addAll(int index, Collection c)
    {
        throw new UnsupportedOperationException("Adding objects to a RecordList is not supported.");
    }

    /**
     * Unsupported operation
     */
    public boolean removeAll(Collection c)
    {
        throw new UnsupportedOperationException("Removing objects from a RecordList is not supported.");
    }

    /**
     * Unsupported operation
     */
    public boolean retainAll(Collection c)
    {
        throw new UnsupportedOperationException("Removing objects from a RecordList is not supported.");
    }

    /**
     * Unsupported operation
     */
    public void clear()
    {
        throw new UnsupportedOperationException("Removing objects from a RecordList is not supported.");
    }

    /**
     * Compares the specified object with this list for equality.
     */
    public boolean equals(Object o)
    {
        return records.equals(o);
    }

    /**
     * Returns the hash code value for this list
     */
    public int hashCode()
    {
        return records.hashCode();
    }

    /**
     * Returns the element at the specified position in this list.
     */
    public E get(int index)
    {
        return records.get(index);
    }

    /**
     * Unsupported operation
     */
    public E set(int index, E element)
    {
        throw new UnsupportedOperationException("Replacing objects in a RecordList is not supported.");
    }
    
    /**
     * Set the record at the specified position, similar to set method in the list
     * 
     * @param index
     * @param element
     * @return
     */
    public Object setRecord(int index, E element)
    {
    	return records.set(index, element);
    }

    /**
     * Unsupported operation
     */
    public void add(int index, E element)
    {
        throw new UnsupportedOperationException("Adding objects to a RecordList is not supported.");
    }

    /**
     * Unsupported operation
     */
    public E remove(int index)
    {
        throw new UnsupportedOperationException("Removing objects from a RecordList is not supported.");
    }

    /**
     * Returns the index in this list of the first occurrence of the specified element, or -1 if this list
     * does not contain this element. More formally, returns the lowest index i such that (o==null ?
     * get(i)==null : o.equals(get(i))), or -1 if there is no such index.
     */
    public int indexOf(Object o)
    {
        return records.indexOf(o);
    }

    /**
     * Returns the index in this list of the last occurrence of the specified element, or -1 if this list does
     * not contain this element. More formally, returns the highest index i such that (o==null ? get(i)==null :
     * o.equals(get(i))), or -1 if there is no such index.
     */
    public int lastIndexOf(Object o)
    {
        return records.lastIndexOf(o);
    }

    /**
     * Returns a list iterator of the elements in this list (in proper sequence).
     */
    public ListIterator<E> listIterator()
    {
        return Collections.unmodifiableList(records).listIterator();
    }

    /**
     * Returns a list iterator of the elements in this list (in proper sequence), starting at the specified
     * position in this list. The specified index indicates the first element that would be returned by an
     * initial call to the next method. An initial call to the previous method would return the element with
     * the specified index minus one.
     */
    public ListIterator<E> listIterator(int index)
    {
        return Collections.unmodifiableList(records).listIterator(index);
    }

    /**
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex,
     * exclusive. (If fromIndex and toIndex are equal, the returned list is empty.) The returned list is
     * backed by this list, so non-structural changes in the returned list are reflected in this list, and
     * vice-versa. The returned list supports all of the optional list operations supported by this list.
     */
    public List<E> subList(int fromIndex, int toIndex)
    {
        return records.subList(fromIndex, toIndex);
    }
	
	/**
	 * @see com.buildonline.common.persistence.query.paging.ExtendedResultPage#getStartRow()
	 **/
    
	public int getStartRow() 
	{
		return firstRecordNumber - 1;
	}
    
    /**
	 * @see com.buildonline.common.persistence.query.paging.ExtendedResultPage#hasNextPage()
	 **/
	
	public boolean hasNextPage() 
	{
		return firstRecordNumber + size() <= totalRecordCount;
	}
	
	/**
	 * @see com.buildonline.common.persistence.query.paging.ExtendedResultPage#hasPreviousPage()
	 **/
	
	public boolean hasPreviousPage() 
	{
		return firstRecordNumber > 1;
	}
	
	/**
	 * @see com.buildonline.common.persistence.query.paging.ExtendedResultPage#getMaximumPageSize()
	 **/
	
	public int getMaximumPageSize() {
		return maxPageSize;
	}
    
    /**
     * @see com.buildonline.common.persistence.query.paging.ExtendedResultPage#getTotalPageCount()
     **/
    
    public int getTotalPageCount() {
        int noOfPages = 0;
        int modCount = 0;

        if (getTotalRowCount() <= getMaximumPageSize()) { 
            noOfPages = 1;
        }
        else {
            modCount = getTotalRowCount() % getMaximumPageSize();
            if(modCount == 0) {
                noOfPages =  (getTotalRowCount() / getMaximumPageSize());
            }
            else {
                noOfPages =  (getTotalRowCount() / getMaximumPageSize()) + 1;
            }
        }
        
       return  noOfPages;
    }
}
