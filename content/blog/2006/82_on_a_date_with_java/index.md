---
title: "On a Date with Java"
date: "2006-01-19 10:13:25"
tags: [imported, java]
category: blog
slug: on_a_date_with_java
---

To start, I really like <a title="Cup of Jo" href="https://www.java.com/en/">Java</a> as a programming language. Because of its "library," it is very is to be productive quickly, without having to reinvent the wheel each time. When you combine that with an IDE like <a title="A godsend..." href="https://www.eclipse.org/">Eclipse</a> and a graphics library like <a title="The only Java glib" href="https://www.eclipse.org/swt/">SWT</a>, Java is amazingly powerful.

Now that I've got that out of the way, let me bitch for a bit. If anything I say is wrong, please let me know as it will relieve much toil.

Java's builtin <a title="java.util.Date" href="https://java.sun.com/j2se/1.4.2/docs/api/java/util/Date.html">Date</a> and <a title="java.util.Calendar" href="https://java.sun.com/j2se/1.4.2/docs/api/java/util/Calendar.html">Calendar</a> classes <em>suck</em>.

The only nice thing about Calendar is the add and roll functions, which I will admit are handy. However, Calendar is a singleton, and does not replace Date... additionally Date is so throughly depreciated, it is almost of no use (especially with the formatting being chucked away in another singleton, <a title="java.text.DateFormat" href="https://java.sun.com/j2se/1.4.2/docs/api/java/text/DateFormat.html">DateFormat</a>).

<strong>Gripe A:</strong>

There is no DeltaDate. No nice way for dealing with deltas between two times (if I've missed something please let me know!). I would love to do the following:

```java
DeltaDate = dateA - dateB;
DeltaDate.toString();
dateA += new DeltaDate(MONTH, 1)
```

Other than getting the unix epoch from each and manually processing, is there any alternative (would need to access the individual fields and have a format for printing)? I realize that last line, you can use Calendar's add and roll functions. But I'm just speaking to the principal of a DeltaDate class.

<strong>Gripe B:</strong>

There is no elegant way of flooring or ceiling a date. The following function is what I've come up with, but let me know if there are improvements to be had.

```java
public static Date floorDateToMonth( Date date )
{
  Calendar cal = Calendar.getInstance();
  cal.setTime(date);
  // Zero out everything below month
  Date newDate = new Date(cal.get(Calendar.YEAR)-1900, cal.get(Calendar.MONTH)-1, 1, 0, 0, 0);
  return newDate;
}
```

<strong>Gripe C:</strong>

I appreciate efforts for internationalization, however it should never corrupt the interface. Calendar and DateFormat were created because there was no good way to internationalize Date. But they bastardized it without giving us an adequate replacement. When you program, you are going to use Dates. Don't make it incredibly cumbersome to do basic processing with it, all for the sake of internationalization.

Again, if I've missed anything, please let me know. (Though Jeff, you may be the only developer who will read this =)
