package com.extjs.common.utils;

import java.util.Collection;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JavaToJSONUtil {

    /**
     * Returns the JSON representation of the given object.
     * 
     * @param object
     * @return
     */
    public static String getJsonString(Object object) {
        Gson gson = new Gson();
        return gson.toJson(object);
    }

    /**
     * Returns the JSON representation of the given object nested in a success and data part. <code>
     * {
     *   success: true || false,
     *   data: [jsonObject]
     * }
     * </code>
     * If the object is a collection then the data is returned without the additional '[' and ']'.
     * 
     * @param success If the JSON string is a success.
     * @param object Object to convert to JSON.
     */
    public static String getJsonStringSuccess(final boolean success, final Object object) {
        final boolean isArray = object instanceof Collection;

        // Build up the string.
        final StringBuilder json = new StringBuilder("{ success: ");
        json.append(success).append(", data: ");

        if (!isArray)
            json.append("[");

        // Append the body.
        json.append(getJsonString(object));

        if (!isArray)
            json.append("]");

        json.append("}");

        return json.toString();
    }
    
    
    public static String getGridJsonStringSuccess(final boolean success, final Object object) {
        // Build up the string.
        final StringBuilder json = new StringBuilder("{ \"success\":");
        json.append("\"" + success + "\"");
        // Append the body.
        List lst = (List) object;
        json.append(",\"page\":1, \"total\":" + lst.size() + ", \"records\":" + lst.size() + ", \"rows\":" + getJsonString(lst));
        json.append("}");
        return json.toString();
    }
    
    /**
     * Returns the JSON representation of the given object nested in a success and data part. <code>
     * {
     *   success: true || false,
     *   data: [jsonObject]
     * }
     * </code>
     * If the object is a collection then the data is returned without the additional '[' and ']'.
     * 
     * @param success If the JSON string is a success.
     * @param object Object to convert to JSON.
     */
    public static String getJsonStringSuccessForDate(final boolean success, final Object object, final String dateFormat) {
        final boolean isArray = object instanceof Collection;

        // Build up the string.
        final StringBuilder json = new StringBuilder("{ success: ");
        json.append(success).append(", data: ");

        if (!isArray)
            json.append("[");

        // Append the body.
        json.append(getJsonStringForDate(object, dateFormat));

        if (!isArray)
            json.append("]");

        json.append("}");

        return json.toString();
    }
    
    /**
     * Returns the JSON representation of the given object and the date format.
     * 
     * @param object
     * @param dateFormat
     * @return
     */
    public static String getJsonStringForDate(Object object, Integer dateFormat) {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.setDateFormat(dateFormat);
        Gson gson = gsonBuilder.create();
        return gson.toJson(object);
    }
    
    /**
     * Returns the JSON representation of the given object and the date format.
     * 
     * @param object
     * @param dateFormat
     * @return
     */
    public static String getJsonStringForDate(Object object, String dateFormat) {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.setDateFormat(dateFormat);
        Gson gson = gsonBuilder.create();
        return gson.toJson(object);
    }


    /**
     * Returns the JSON representation of the given object and the date and time format.
     * 
     * @param object
     * @param dateFormat
     * @param timeFormat
     * @return
     */
    public static String getJsonStringForDateAndTime(Object object, Integer dateFormat, Integer timeFormat) {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.setDateFormat(dateFormat, timeFormat);
        Gson gson = gsonBuilder.create();
        return gson.toJson(object);
    }

    /**
     * Returns the JSON representation of the given Key and Value.
     * 
     * @param map
     * @return
     */
    public static String getJsonStringForKeyValue(Object key, Object value) {
        Gson gson = new Gson();
        Map<Object, Object> map = new Hashtable<Object, Object>();
        map.put(key, value);
        return gson.toJson(map);
    }

    /**
     * Returns the JSON representation of the given object including the null values for the fields.
     * 
     * @param object
     * @param dateFormat
     * @param timeFormat
     * @return
     */
    public static String getJsonStringWithNullFieldsIncluded(Object object) {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.serializeNulls();
        Gson gson = gsonBuilder.create();
        return gson.toJson(object);
    }

    /**
     * Returns the JSON representation to populate the form.
     * 
     * @param object
     * @param dateFormat
     * @param timeFormat
     * @return
     */
    public static String getJsonFormString(Object object) {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.serializeNulls();
        Gson gson = gsonBuilder.create();
        //IPolCoreFormBean polCoreFormBean = (IPolCoreFormBean) object;
        //List<ValidationError> errors = polCoreFormBean.getErrors();
        //if (errors.isEmpty()) {
            return "{success:true,data:" + gson.toJson(object) + "}";
        //}
       // else {
         //   return "{success:false,errorMessage:" + gson.toJson(errors) + "}";
       // }
    }
    
    /**
     * Returns the JSON representation to populate the form.
     * 
     * @param object
     * @param dateFormat
     * @param timeFormat
     * @return
     */
    public static Object getJavaFormJSON(String json, Object obj) {
        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.serializeNulls();
        Gson gson = gsonBuilder.create();
        return gson.fromJson(json, obj.getClass());
    }

}
